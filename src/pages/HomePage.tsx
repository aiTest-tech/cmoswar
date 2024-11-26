import { useState, useRef, useEffect } from "react";
import Navbar from "../component/Navbar";
import { AiFillAudio } from "react-icons/ai";
import axios from "axios";
import { Modal } from "flowbite-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaArrowAltCircleRight } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";
import ReactSpeedometer from "react-d3-speedometer/slim"

type Language = "gu" | "en";

type SentimentResponse = {
  sentiment: "Neutral" | "Negative" | "Positive";
  gravity: number;
};

const HomePage = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [transcriptionId, setTranscriptionId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>("gu");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editedTranscription, setEditedTranscription] = useState<string>(null);
  const [gravity, setGravity] = useState(0);
  const [sentimentResponse, setSentimentResponse] = useState<SentimentResponse>({
    sentiment: null,
    gravity: null,
  });



  // Start recording audio
  const startRecording = async () => {
    try {
      setIsRecording(true);
      audioChunks.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const wavBlob = await convertWebmToWav(audioBlob);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
        await sendAudioToBackend(wavBlob);
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // Convert WebM Blob to WAV format
  const convertWebmToWav = async (webmBlob: Blob): Promise<Blob> => {
    const audioContext = new AudioContext();
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const wavBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  // Helper function for converting AudioBuffer to WAV
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2 + 44; // WAV file header length
    const wavArrayBuffer = new ArrayBuffer(length);
    const view = new DataView(wavArrayBuffer);

    // Write the WAV header
    writeString(view, 0, "RIFF");
    view.setUint32(4, length - 8, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk size for fmt
    view.setUint16(20, 1, true);  // PCM format
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numberOfChannels * 2, true); // Byte rate
    view.setUint16(32, numberOfChannels * 2, true);  // Block align
    view.setUint16(34, 16, true);  // Bits per sample
    writeString(view, 36, "data");
    view.setUint32(40, buffer.length * numberOfChannels * 2, true);

    // Write audio data
    let offset = 44;
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        view.setInt16(offset, channelData[i] * 0x7FFF, true);
        offset += 2;
      }
    }

    return wavArrayBuffer;
  };

  // Helper function to write a string to a DataView at the given offset
  const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // Send audio to backend for transcription processing
  const sendAudioToBackend = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("lang", language); // Dynamically use selected language
      formData.append("secret_key", "wtc@12345");

      const response = await axios.post("http://10.10.2.179:6162/api/speech-to-text2/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("brijesh response", response);

      const transcriptionText = response.data.text || "No transcription available";
      setTranscription(transcriptionText);
      setTranscriptionId(response.data.id);
      setEditedTranscription(transcriptionText); // Set the initial transcription text to be editable
    } catch (error) {
      console.error("Error sending audio to backend:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle language change via radio buttons
  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value as Language);
  };

  // Handle transcription edit
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    setTranscription(editedTranscription);
    setIsModalOpen(false);
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("id", transcriptionId);
      formData.append("text", editedTranscription);

      const response = await axios.post("http://10.10.2.179:6162/api/submit-audio/", formData, {
        headers: {
          "Content-Type": "mutlipart/form-data"
        }
      })
      console.log("brijesh response submit-audio", response)
      if (response.data.status === "success") {
        // setTranscription(null);
        // setTranscriptionId(null);
        setLoading(false);
      }
    } catch (error) {
      console.log("brijesh error aave che", error)
    }
  };

  const handlesentiment = async () => {
    try {
      if (editedTranscription != null) {
        setLoading(true);
        const formData = new FormData();
        formData.append("data", editedTranscription);
        formData.append("lang", language);
        const response = await axios.post("http://10.10.2.179:6162/api/sentiment/", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        setLoading(false);
        setSentimentResponse(response.data);
      } else {
        const formData = new FormData();
        formData.append("data", transcription);
        formData.append("lang", language);
        const response = await axios.post("http://10.10.2.179:6162/api/sentiment/", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        setSentimentResponse(response.data);
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const getSpeedometerValue = () => {
    if (sentimentResponse.sentiment === "Neutral") {
      return 50; // Neutral, point at the center (0)
    } else if (sentimentResponse.sentiment === "Negative") {
      return (1 - sentimentResponse.gravity) * 50; // Negative, on the left
    } else {
      return sentimentResponse.gravity * 50; // Positive, on the right
    }
  };

  // Determine color based on sentiment
  const getColor = () => {
    if (sentimentResponse.sentiment === "Negative") {
      return "#ff4d4d"; // Red for Negative
    } else if (sentimentResponse.sentiment === "Neutral") {
      return "#f0e68c"; // Yellow for Neutral
    } else {
      return "#4caf50"; // Green for Positive
    }
  };

  useEffect(() => {
    // Simulate an API call with setTimeout or actual API call here
    const fetchApiData = async () => {
      // Simulate a delay for the API response
      setTimeout(() => {
        const gravityValue = 0.5; // Example gravity value from API (between -1 to 1)
        setGravity(gravityValue); // Set the gravity value to state
      }, 2000); // Simulate API delay of 2 seconds
    };

    fetchApiData();

  }, [gravity]);

  return (
    <>
      <Navbar />
      <div className="absolute top-[120px] left-[40px] z-[555]">
        {/* <ReactSpeedometer
          value={333}
          segments={5}
          segmentColors={[
            "#bf616a",
            "#d08770",
            "#ebcb8b",
            "#a3be8c",
            "#b48ead",
          ]}
        // startColor will be ignored
        // endColor will be ignored
        /> */}
        {
          sentimentResponse.gravity != null && (
            <>
              {sentimentResponse.sentiment === "Negative" && (
                <span role="img" aria-label="danger" style={{ fontSize: '40px', color: 'red' }}>
                  <span className="font-extrabold">Negative</span> {sentimentResponse.gravity.toFixed(2)}
                </span>
              )}
              {sentimentResponse.sentiment === "Positive" && (
                <span role="img" aria-label="smiley" style={{ fontSize: '40px', color: 'green' }}>
                  <span className="font-extrabold">Positive</span> {sentimentResponse.gravity.toFixed(2)}
                </span>
              )}
              {sentimentResponse.sentiment === "Neutral" && (
                <span role="img" aria-label="neutral" style={{ fontSize: '40px', color: 'gray' }}>
                  <span className="font-extrabold">Neutral</span> {sentimentResponse.gravity.toFixed(2)}
                </span>
              )}
            </>
          )
        }

      </div>
      <div className="relative top-16 flex justify-center mt-10">
        <div className="flex flex-col max-w-[90%] w-full gap-8">
          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="language"
                value="gu"
                className="form-radio text-blue-600"
                checked={language === "gu"}
                onChange={handleLanguageChange}
              />
              <span className="text-white text-xl">Gujarati</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="language"
                value="en"
                className="form-radio text-blue-600"
                checked={language === "en"}
                onChange={handleLanguageChange}
              />
              <span className="text-white text-xl">English</span>
            </label>
          </div>
          <div className="flex justify-center items-center space-x-6">
            <div
              className={`p-6 rounded-full cursor-pointer bg-blue-500 hover:bg-blue-600 transition duration-300 ${isRecording ? "bg-red-600" : ""
                }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <AiFillAudio className="text-white w-[40px] h-[40px]" />
            </div>
            <div className="text-white text-xl">
              {isRecording ? "Recording..." : "Click to Record"}
            </div>
          </div>

          {/* Audio Player & Transcription */}
          {audioUrl && (
            <div className="text-center space-y-4">
              <audio controls src={audioUrl} className="md:w-[30%] mx-auto w-full" />
              <div className="text-white mt-4">
                {transcription && (<h2 className="font-bold">Transcription:</h2>)}
                {transcription && (
                  <div className="max-w-md:w-[50%] md:w-[10%] mt-8 mx-auto">
                    <div className="text-black dark:text-black">
                      <div className="w-[500px] relative max-h-[200px] overflow-auto  -left-[200px] border-primary p-2  text-white text-xl">
                        {transcription}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleEdit}
                          className="bg-blue-500 text-white p-2 rounded-full px-3 dark:bg-black dark:text-white"
                        >
                          Edit
                        </button>
                        <button className="bg-green-700 text-white p-2 px-3 rounded-full" onClick={handlesentiment}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center absolute w-[90vw] h-[100vh]">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}

          {/* Modal for Editing Transcription */}
          <Modal show={isModalOpen} onClose={handleModalClose}>
            <Modal.Header>Edit Transcription</Modal.Header>
            <Modal.Body>
              <textarea
                value={editedTranscription}
                onChange={(e) => setEditedTranscription(e.target.value)}
                rows={5}
                className="w-full p-2 border rounded"
              />
            </Modal.Body>
            <Modal.Footer>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default HomePage;
