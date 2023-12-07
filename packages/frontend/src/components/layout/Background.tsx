enum Image {
  WEB_FRONT = "WEB_FRONT",
  CONSOLE = "CONSOLE"
}
type Props = {
  bgImage: keyof typeof Image
}
function BackgroundImage(props: Props) {
  return (
    <>
      <div
        style={
          props.bgImage == Image.WEB_FRONT ? { backgroundSize: "auto 100%" } : { backgroundSize: "cover" }
        }
        className={`overflow-hidden absolute bottom-0 w-full -z-10 ${props.bgImage == Image.WEB_FRONT ? 'bg-[url(/src/assets/png/LineBackground.png)]' : 'bg-[url(/src/assets/png/consoleOperatorBackground.png)]'} bg-no-repeat h-full`}>
      </div>
      <div
        style={{ backgroundSize: "cover" }}
        className={`absolute top-0 right-0 -z-10 overflow-hidden ${props.bgImage == Image.WEB_FRONT ? 'bg-[url(/src/assets/png/CircleBackground.png)]' : ''} bg-no-repeat w-[220px] lg:w-[330px] h-[270px] lg:h-[370px]`}>
      </div>
    </>
  );
}

export default BackgroundImage;