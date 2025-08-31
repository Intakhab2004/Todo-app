

const Loader = () => {
  return (
        <div className="flex justify-center items-center py-10">
            <div className="flex space-x-3">
                <div className="w-4 h-4 rounded-full animate-bounce bg-gradient-to-r from-red-500 via-pink-500 to-red-500 shadow-lg shadow-red-500/50"></div>
                <div className="w-4 h-4 rounded-full animate-bounce bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-lg shadow-blue-500/50 delay-150"></div>
                <div className="w-4 h-4 rounded-full animate-bounce bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 shadow-lg shadow-purple-500/50 delay-300"></div>
            </div>

            <style jsx>{`
                .delay-150 {
                    animation-delay: 0.15s;
                }
                .delay-300 {
                    animation-delay: 0.3s;
                }
            `}</style>
        </div>
    )
}

export default Loader;
