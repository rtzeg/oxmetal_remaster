import { Triangle } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className=" fixed top-1/2 left-1/2 cente  -translate-x-1/2 -translate-y-1/2">
      <Triangle
        height="80"
        width="80"
        color="#C5E500"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClassName="fixed top-1/2 left-1/2"
        visible={true}
      />
    </div>
  );
};

export default Loading;
