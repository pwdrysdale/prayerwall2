import React from "react";

const Button: React.FunctionComponent<
    React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > & { title?: string }
> = ({ title, children, style, ...rest }) => (
    <button
        {...rest}
        style={{
            ...style,
            cursor: "pointer",
            backgroundColor: "blue",
            color: "white",
            fontSize: "large",
        }}
    >
        {title ?? children}
    </button>
);

export default Button;
