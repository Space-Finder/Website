import { useEffect, useMemo } from "react";

export const useChannel = <TInput>({
    channelName,
    messageHandler,
}: {
    channelName: string;
    messageHandler: (message: MessageEvent<TInput>) => void;
}) => {
    const channel = useMemo(
        () => new BroadcastChannel(channelName),
        [channelName],
    );
    const receiveChannel = useMemo(
        () => new BroadcastChannel(channelName),
        [channelName],
    );

    const broadcast = (message: TInput) => {
        channel.postMessage(message);
    };

    useEffect(() => {
        channel.addEventListener("message", messageHandler);
        receiveChannel.addEventListener("message", messageHandler);

        return () => {
            channel.removeEventListener("message", messageHandler);
            receiveChannel.removeEventListener("message", messageHandler);
        };
    }, [channel, receiveChannel, messageHandler]);

    return {
        broadcast,
    };
};
