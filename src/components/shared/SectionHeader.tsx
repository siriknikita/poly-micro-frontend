interface SectionHeaderProps {
  title: string;
  HeaderIcon: React.ElementType;
  headerClassName?: string;
  iconClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  HeaderIcon,
  headerClassName,
  iconClassName,
}) => {
  return (
    <h3 className={headerClassName} data-testId="section-header">
      <HeaderIcon className={iconClassName} />
      {title}
    </h3>
  );
};

export default SectionHeader;
