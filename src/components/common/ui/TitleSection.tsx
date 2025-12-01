type Props = {
  text: string;
};

const TitleSection = ({ text }: Props) => {
  return <p className="pb-2 text-xl font-bold text-gray-800 ">{text}</p>;
};

export default TitleSection;
