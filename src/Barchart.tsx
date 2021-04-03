import * as React from "react";
import { HorizontalBar } from 'react-chartjs-2';

const Barchart = (props: any) => {
    const barData = {
        labels: [],
        datasets: [
            {
                label: 'Seconds',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: []
            }
        ]
    }
    const { labels, datum } = props;
    const [state, setState] = React.useState(barData);


    React.useEffect(() => {
        let newBarData = barData;
        newBarData.labels = labels;
        newBarData.datasets.map((dt: any) => { dt.data = datum });
        setState(newBarData)

    }, [labels, datum])


    return (
        <div>
            {/* <h2>Horizontal Bar Example</h2> */}
            <HorizontalBar data={state} />
        </div>
    );

}

export default Barchart;