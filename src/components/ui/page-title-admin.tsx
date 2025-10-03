interface PageTitleProps {
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  action?: React.ReactNode;
  dialog?: React.ReactNode;
}

export const PageTitleAdmin: React.FC<PageTitleProps> = ({
  title,
  description,
  className = "",
  titleClassName = "text-3xl font-bold",
  descriptionClassName = "text-gray-3 mt-2",
  action,
  dialog,
}) => {
  return (
    <>
      <div
        className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${className}`}
      >
        <div className="flex-1">
          <h1 className={titleClassName}>{title}</h1>
          {description && <p className={descriptionClassName}>{description}</p>}
        </div>

        {(action || dialog) && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {action}
            {dialog}
          </div>
        )}
      </div>
    </>
  );
};
