import { Link } from "react-router-dom";

export const Logo = ({src = '/logo.svg'}) => {
  return (
    <>
      <Link to="/" className="flex items-center gap-2 self-center">
        <img
        src={src}
        alt="Remittance Inc."
        className={`block shrink-0 object-contain transition-[width] duration-100 h-12 w-80`}
      />
      </Link>
    </>
  );
};
