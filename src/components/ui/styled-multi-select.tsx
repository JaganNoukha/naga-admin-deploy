import Select, { StylesConfig, components } from "react-select";

const customStyles: StylesConfig = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.isFocused ? "var(--color-freshleaf)" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-freshleaf)" : "none",
    "&:hover": {
      borderColor: "var(--color-freshleaf)",
    },
    fontSize: "0.900rem",
    fontWeight: "400",
    borderRadius: "0.6rem",
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isSelected
      ? "var(--color-freshleaf)"
      : state.isFocused
      ? "#e2e8f0"
      : "white",
    
    color: state.isSelected ? "white" : "black",
    fontSize: "0.900rem",
    fontWeight: "400",
  }),
  menuList: (baseStyles) => ({
    ...baseStyles,
    fontSize: "0.900rem",
    "::-webkit-scrollbar": {
      width: "4px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#888",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    scrollbarWidth: "thin",
    scrollbarColor: "var(--freshleaf) #f1f1f1",
    fontWeight: "400",
  }),
};

const MoreSelectedBadge = ({ items }: { items: string[] }) => {
  const style = {
    marginLeft: "auto",
    background: "#D8FAE9",
    borderRadius: "4px",
    fontFamily: "inherit",
    fontSize: "11px",
    padding: "2px 6px",
    order: 99,
    color: "#333",
    fontWeight: "500",
  };

  const title = items.join(", ");
  const length = items.length;
  const label = `+ ${length} Item${length !== 1 ? "s" : ""}`;

  return (
    <div style={style} title={title}>
      {label}
    </div>
  );
};

const MultiValue = ({ index, getValue, maxToShow = 3, ...props }: any) => {
  const overflow = getValue()
    .slice(maxToShow)
    .map((x: any) => x.label);

  return index < maxToShow ? (
    <components.MultiValue {...props} />
  ) : index === maxToShow ? (
    <MoreSelectedBadge items={overflow} />
  ) : null;
};

export const StyledMultiSelect = ({ maxToShow = 3, ...props }: any) => {
  const customComponents = {
    MultiValue: (multiValueProps: any) => (
      <MultiValue {...multiValueProps} maxToShow={maxToShow} />
    ),
    ...props.components,
  };

  return (
    <Select
      {...props}
      styles={customStyles}
      className="basic-single text-base"
      classNamePrefix="select"
      components={customComponents}
    />
  );
};
