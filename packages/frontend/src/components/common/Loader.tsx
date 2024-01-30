import Spinner from "../ui/spinner";

function Loader(props:{className?:string}) {
  return (
    <div>
      <div className={`absolute w-full h-full grid place-content-center  bg-[#7b797936] z-10  ${props.className} `}>
        <Spinner color="#F99807" className="h-20 w-20" />
      </div>
    </div>
  );
}

export default Loader;
