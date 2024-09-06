const Greeting = ({
    commonColor,
    name,
}: {
    commonColor: string;
    name: string;
}) => {
    const hour = new Date().getHours();
    const greeting =
        "Good " +
        ((hour < 12 && "Morning") || (hour < 18 && "Afternoon") || "Evening");
    return (
        <h1 style={{ color: commonColor }} className="drop-shadow-sm">
            {greeting}, {name.split(" ")[0]}
        </h1>
    );
};

export default Greeting;
