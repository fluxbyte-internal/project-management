function BackgroundImage() {
  return (
    <>
      <div
        style={{
          backgroundSize: "contain",
          backgroundPosition: "left bottom",
        }}
        className={`overflow-hidden absolute bottom-0 w-full h-3/5 -z-10 bg-[url(/src/assets/png/LineBackground.png)] bg-no-repeat`}
      ></div>
      <div
        style={{
          backgroundSize: "contain",
          backgroundPosition: "right top",
        }}
        className={`absolute top-0 right-0 -z-10 w-1/3 max-w-[50%] h-1/3 overflow-hidden bg-[url(/src/assets/png/CircleBackground.png)] bg-no-repeat`}
      ></div>
    </>
  );
}
export default BackgroundImage;