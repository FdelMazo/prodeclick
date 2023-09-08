import dynamic from 'next/dist/shared/lib/dynamic'
import React from 'react'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

class PieChart extends React.Component {
  state = {
    chartData: [],
    chartOptions: {}
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions
    })
  }

  render() {
    return (
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type='pie'
      />
    )
  }
}

export default PieChart
