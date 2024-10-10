import Image from "next/image";
import Logo from "/public/spacelogo.png";

const StudentMessage = () => {
    return (
        <section className="my-32">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-5">
                <div className="flex flex-col items-center justify-end gap-6">
                    <h1 className="flex items-center gap-2 font-poppins text-3xl">
                        SpaceFinder{" "}
                        <Image
                            src={Logo}
                            alt="logo"
                            className="h-7 w-auto"
                            placeholder="blur"
                        />
                    </h1>
                    <h2 className="font-manrope text-center text-5xl font-bold leading-normal text-black md:text-6xl">
                        Teachers Only!
                    </h2>
                    <p className="text-center text-base font-normal leading-relaxed text-black">
                        Sorry mate, currently SpaceFinder is only for teachers
                        to use. <br /> We may make a student portal in the
                        future. <br /> For Inquiries Contact:{" "}
                        <a
                            href=""
                            className="font-bold underline hover:text-gray-500"
                        >
                            {" "}
                            st22209@ormiston.school.nz
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default StudentMessage;
