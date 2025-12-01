const SkeletonSize = () => {
  return (
    <section className="choose-size mt-5">
      <div className="heading flex items-center justify-between">
        <h2 className="text-title">Elige tu talla:</h2>
      </div>
      <div className="list-size mt-3 flex flex-wrap items-center gap-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-12 w-12 animate-pulse rounded-full bg-gray-300"
          ></div>
        ))}
      </div>
    </section>
  );
};

export default SkeletonSize;
