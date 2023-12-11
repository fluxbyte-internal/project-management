import Spinner from "../ui/spinner";

function Loader() {
  return (
    <div>
      <div className="absolute w-full h-full grid place-content-center  bg-[#7b797936] z-10 ">
        <Spinner color="#F99807" className="h-20 w-20" />
      </div>
    </div>
  );
}

export default Loader;
