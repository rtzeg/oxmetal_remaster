import styles from './Admin.module.scss';

export default function Input({ type, placeholder, width, ...props }) {
  const customStyle = {
    '--input-width': width,
  };
  return (
    <input
      {...props}
      className={styles.adminInput}
      style={customStyle}
      type={type}
      placeholder={placeholder}
    />
  );
}
