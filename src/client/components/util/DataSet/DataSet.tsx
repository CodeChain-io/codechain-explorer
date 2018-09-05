import * as _ from "lodash";
import * as React from "react";

interface Props {
    className?: string;
    isStatus?: boolean;
}

class DataSet extends React.Component<Props, {}> {
    private refList: Array<React.RefObject<any>>;
    constructor(props: Props) {
        super(props);
    }

    public componentDidMount() {
        _.each(this.refList, ref => {
            if (ref.current) {
                ref.current.setAttribute("title", ref.current.innerText);
            }
        });
    }

    public componentDidUpdate() {
        _.each(this.refList, ref => {
            if (ref.current) {
                ref.current.setAttribute("title", ref.current.innerText);
            }
        });
    }

    public render() {
        const { children, isStatus, className } = this.props;
        if (!children) {
            return null;
        }
        this.refList = [];
        const childrenWithTitle = React.Children.map(children, (child: React.ReactElement<any>) => {
            if (!child) {
                return null;
            }
            if (child.type === "hr") {
                return child;
            } else {
                const childList = React.Children.map(
                    child.props.children,
                    (childInner: React.ReactElement<any>, index: number) => {
                        if (index === 0) {
                            return childInner;
                        } else {
                            if (!childInner || !childInner.props.children) {
                                return null;
                            }
                            if (
                                childInner.props.children.type === "div" &&
                                childInner.props.children.props.className === "text-area"
                            ) {
                                return childInner;
                            }
                            const newRef = React.createRef();
                            this.refList.push(newRef);
                            const wrapper = React.createElement(
                                "div",
                                { ref: newRef, className: "wrapper-for-title" },
                                childInner.props.children
                            );
                            return React.cloneElement(childInner, {}, wrapper);
                        }
                    }
                );
                return React.cloneElement(child, {}, childList);
            }
        });
        return (
            <div className={`${isStatus ? "data-set-for-status" : "data-set"} ${className}`}>{childrenWithTitle}</div>
        );
    }
}

export default DataSet;
