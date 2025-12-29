/* eslint-disable react/prop-types */

const RadioBtns = ({ elem, Active, setActive }) => {
    const active = Active == elem ? "change opacity-100" : "change"
  return (
    <div className="radioBtns cursor-pointer" onClick={()=>{
      if(elem == Active){
        setActive('')
      }else{
        setActive(elem)
      }
       
    }}>
      <div className="but">
        <div className={active}></div>
      </div>
      <p>{elem}</p>
    </div>
  );
};

export default RadioBtns;
