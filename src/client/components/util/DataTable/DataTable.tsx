import * as _ from "lodash";
import * as React from "react";
import { Table } from "reactstrap";

interface Props {
    className?: string;
}

class DataTable extends React.Component<Props, {}> {
    private refList: Array<React.RefObject<any>>;
    constructor(props: {}) {
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
        const { className, children } = this.props;
        if (!children) {
            return null;
        }
        this.refList = [];
        const tbody = children[1];
        let cloneTbody;
        if (tbody) {
            cloneTbody = React.Children.map(tbody.props.children, (tr: any) => {
                const tdList = React.Children.map(tr.props.children, (td: any) => {
                    const newRef = React.createRef();
                    this.refList.push(newRef);
                    return React.cloneElement(td, {
                        ref: newRef
                    });
                });
                return React.cloneElement(tr, {}, tdList);
            });
        }
        return (
            <Table striped={true} className={`data-table ${className}`}>
                {children[0]}
                {tbody ? <tbody>{cloneTbody}</tbody> : null}
            </Table>
        );
    }
}

export default DataTable;
