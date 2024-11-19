import React, { useState } from 'react';

const Dropdown: React.FC = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [openSublist, setOpenSublist] = useState<number | null>(null);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default form behavior or page refresh
        setIsDropdownVisible(!isDropdownVisible);
    };

    const toggleSubDir = (index: number) => {
        setOpenSublist(index === openSublist ? null : index); // Toggle between sublists
    };

    return (
        <div>
            <button
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:bg-gray-100 w-64 p-4 shadow rounded bg-white text-sm font-medium leading-none text-gray-800 flex items-center justify-between cursor-pointer"
                onClick={toggleDropdown}
            >
                Channels
                <div>
                    <div className={isDropdownVisible ? 'hidden' : ''}>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.00016 5.33333L0.333496 0.666664H9.66683L5.00016 5.33333Z" fill="#1F2937" />
                        </svg>
                    </div>
                    <div className={isDropdownVisible ? '' : 'hidden'}>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.00016 0.666664L9.66683 5.33333L0.333496 5.33333L5.00016 0.666664Z" fill="#1F2937" />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Dropdown List */}
            {isDropdownVisible && (
                <div className="w-64 mt-2 p-4 bg-white shadow rounded">
                    {/* Facebook Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg
                                role="button"
                                aria-label="dropdown"
                                onClick={() => toggleSubDir(1)}
                                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md"
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4.5 3L7.5 6L4.5 9" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <div className="pl-4 flex items-center">
                                <div className="bg-gray-100 border rounded-sm w-3 h-3 flex flex-shrink-0 justify-center items-center relative">
                                    <input
                                        aria-labelledby="fb1"
                                        type="checkbox"
                                        className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
                                    />
                                    <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <path d="M5 12l5 5l10 -10" />
                                        </svg>
                                    </div>
                                </div>
                                <p id="fb1" className="text-sm leading-normal ml-2 text-gray-800">Facebook</p>
                            </div>
                        </div>
                        <p className="w-8 text-xs leading-3 text-right text-indigo-700">2,381</p>
                    </div>

                    {/* Sublist 1 */}
                    {openSublist === 1 && (
                        <div className="pl-8 pt-5">
                            {/* Add sublist items here */}
                            <div className="flex items-center justify-between">
                                <div className="pl-4 flex items-center">
                                    <div className="bg-gray-100 border rounded-sm w-3 h-3 flex flex-shrink-0 justify-center items-center relative">
                                        <input
                                            aria-labelledby="usa1"
                                            type="checkbox"
                                            className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
                                        />
                                        <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p id="usa1" className="text-sm leading-normal ml-2 text-gray-800">USA</p>
                                </div>
                                <p className="w-8 text-xs leading-3 text-right text-indigo-700">2,381</p>
                            </div>
                            {/* Add other sublist items */}
                        </div>
                    )}

                    {/* Repeat for other sublists */}
                    <button className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none focus:bg-indigo-200 text-xs bg-indigo-100 hover:bg-indigo-200 rounded-md mt-6 font-medium py-2 w-full leading-3 text-indigo-700">
                        Select
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
