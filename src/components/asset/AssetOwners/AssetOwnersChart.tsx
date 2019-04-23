import * as React from "react";
const { ResponsivePie } = require("@nivo/pie");

import { AggsUTXODoc } from "codechain-indexer-types";
import { U64 } from "codechain-primitives/lib";

interface OwnProps {
    aggsUTXO: AggsUTXODoc[];
}

type Props = OwnProps;

class AssetOwnersChart extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <div className="pie-chart-container">
                <div className="chart">
                    <div className="chart-item">{this.renderPieChart()}</div>
                </div>
            </div>
        );
    }

    public renderPieChart() {
        const { aggsUTXO } = this.props;

        const n = aggsUTXO.length === 11 ? 11 : 10;
        const topOwners = aggsUTXO.slice(0, n);
        const others = aggsUTXO.slice(n);

        const data = topOwners.map(i => {
            return {
                id: `${i.address.slice(0, 10)}...`,
                label: `${i.address.slice(0, 10)}...`,
                value: new U64(i.totalAssetQuantity).value.toNumber()
            };
        });
        data.push({
            id: "Others",
            label: "Others",
            value: others.reduce((sum, owner) => sum.plus(owner.totalAssetQuantity), new U64(0)).value.toNumber()
        });
        return (
            <ResponsivePie
                data={data}
                keys={["id"]}
                indexBy="value"
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 20
                }}
                colors="set3"
                theme={{
                    tooltip: {
                        container: {
                            fontSize: "13px"
                        }
                    },
                    labels: {
                        textColor: "#555"
                    }
                }}
                animate={true}
                innerRadius={0.3}
                motionStiffness={90}
                motionDamping={15}
                radialLabelsSkipAngle={30}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#000000"
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                // tslint:disable-next-line:jsx-no-lambda
                radialLabel={(d: any) => `${d.id}`}
                slicesLabelsSkipAngle={20}
                slicesLabelsTextColor="#000000"
            />
        );
    }
}

export default AssetOwnersChart;
