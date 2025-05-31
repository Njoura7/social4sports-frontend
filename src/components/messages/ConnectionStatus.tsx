interface ConnectionStatusProps {
    isConnected: boolean;
}

const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
    return (
        <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
            {isConnected ? 'Connected' : 'Connecting...'}
        </div>
    );
};

export default ConnectionStatus;