/* eslint-disable react/prop-types */
const ColorBtns = ({ elem, Active, setActive }) => {
    const active = Active == elem.name ? "w-full h-[40px] rounded-lg relative colorActive" : " w-full h-[40px] rounded-lg relative"
  return (
    <div className=" flex-col flex items-center cursor-pointer" onClick={()=>{
     
        if(elem.name == Active){
          setActive('')
        }else{
          setActive(elem.name)
        }
    }}>
      <div
        className={active}
        style={{ background: elem.color , boxShadow: "0px 1px 5px black" }}
      ></div>
      <p className="colorName mt-2">{elem.name}</p>
    </div>
  );
};

export default ColorBtns;
