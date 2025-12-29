export default function Input({ type, placeholder, width, ...props }) {
  const customStyle = {
    width: width,
    borderBottom: '1px solid black',
    fontSize: '20px',
    paddingTop: '16px',
    outline: 'none',
    marginTop: '15px',
  };
  return <input {...props} style={customStyle} type={type} placeholder={placeholder} />;
}
