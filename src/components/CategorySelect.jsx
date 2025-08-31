import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CategorySelect({ categories, selected, setSelected }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event){
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [])

    return (
        <div ref={dropdownRef} className="relative w-full md:w-[15rem] ml-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center bg-white/10 font-medium backdrop-blur-sm border border-white/20 text-white text-sm rounded-lg px-3 py-2 focus:outline-none transition"
            >
                {selected}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <ul className="absolute mt-1 w-full bg-white/10 backdrop-blur-md border border-gray-400 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    <li
                        onClick={() => {
                            setSelected("All Categories");
                            setIsOpen(false);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-black/10 text-sm text-white font-semibold"
                    >
                        All Categories
                    </li>
                    {
                        categories.map((category, idx) => (
                            <li
                                key={idx}
                                onClick={() => {
                                    setSelected(category.name);
                                    setIsOpen(false);
                                }}
                                className="px-3 py-2 cursor-pointer hover:bg-black/10 text-sm text-white font-semibold"
                            >
                                {category.name}
                            </li>
                        ))
                    }
                </ul>
            )}
        </div>
    )
}
