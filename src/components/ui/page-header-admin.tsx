interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export const PageHeaderAdmin: React.FC<PageHeaderProps> = ({
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-gray-3 mt-2">{description}</p>}
      </div>
    </div>
  );
};
