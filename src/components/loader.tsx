

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-center"></div>
      </div>
    </div>
  )
}

export default Loader

interface SkeletonProps {
  width?: string;
  count?: number;
  height?: string;
}

export const SkeletonLoader = ({ width = "unset", count = 3, height }: SkeletonProps) => {
  return (
    <div className="skeleton-loader" style={{ width }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-shape" style={height ? { height } : undefined}></div>
      ))}
    </div>
  );
}
