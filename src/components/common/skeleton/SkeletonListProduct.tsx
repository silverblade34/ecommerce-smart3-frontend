const SkeletonListProduct = () => {
  return (
    <div className='container flex h-full w-full flex-col items-center justify-center gap-y-5'>
      <div className='flex w-full animate-pulse items-center justify-center space-x-4 rounded-2xl bg-gradient-to-br from-secondary2_sokso/70 to-transparent py-5 md:h-[50px] '>
        <div>
          <p className='mx-auto mt-4 h-2 w-80 rounded-lg bg-primary_sokso/70 '></p>
        </div>
      </div>
      <div className='flex h-full  w-full flex-col gap-y-10 md:flex-row md:space-x-10'>
        <div className='w-full animate-pulse rounded-2xl bg-gradient-to-br from-secondary2_sokso/70 to-transparent p-5 lg:w-1/3 '>
          <div className='flex flex-col space-y-6'>
            <p className='mt-4 h-1 w-36 rounded-lg bg-primary_sokso/70 '></p>
            <p className='mt-4 h-2 w-24 rounded-lg bg-primary_sokso/70  '></p>
            <p className='mt-4 h-0.5 w-full rounded-lg bg-primary_sokso/70 '></p>
            <p className='mt-4 h-2 w-24 rounded-lg bg-primary_sokso/70  '></p>
            <div className='flex space-x-5'>
              <div className='h-12 w-12 rounded-xl bg-primary_sokso/70 '></div>
              <div className='h-12  w-12 rounded-xl bg-primary_sokso/70 '></div>
              <div className='h-12  w-12 rounded-xl bg-primary_sokso/70 '></div>
            </div>
            <p className='mt-4 h-2 w-24 rounded-lg bg-primary_sokso/70  '></p>
            <div className='flex space-x-5'>
              <div className='h-12 w-12 rounded-full bg-primary_sokso/70 '></div>
              <div className='h-12 w-12 rounded-full bg-primary_sokso/70 '></div>
              <div className='h-12  w-12 rounded-full bg-primary_sokso/70 '></div>
            </div>
            <p className='mt-4 h-2 w-24 rounded-lg bg-primary_sokso/70  '></p>
            <div className='flex justify-between space-x-5'>
              <p className='mt-4 h-16 w-64 rounded-lg bg-primary_sokso/70  '></p>
              <p className='mt-4 h-16 w-full rounded-lg bg-primary_sokso/70  '></p>
            </div>
            <p className='mt-4 h-16 w-full rounded-lg bg-primary_sokso/70  '></p>
          </div>
        </div>
        <div className=' grid h-[200px] w-full animate-pulse grid-cols-2 gap-5 rounded-2xl bg-gradient-to-br  from-secondary2_sokso/70 to-transparent p-3 md:h-[600px] md:grid-cols-3 lg:w-2/3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='flex flex-col items-center justify-center rounded-lg border border-line p-5'
            >
              <svg
                className='h-16 w-16 text-primary_sokso'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 18'
              >
                <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
              </svg>
              <p className='mt-4 h-1 w-8 rounded-lg bg-primary_sokso/70 '></p>
              <p className='mt-4 h-2 w-8 rounded-lg bg-primary_sokso/70  '></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonListProduct;
