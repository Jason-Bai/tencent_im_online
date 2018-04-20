import React from 'react';
import NodeSchedule from 'node-schedule';
import Helmet from 'components/Helmet';
import ImOnlineTable from './ImOnlineTable';
import HomeAPI from 'apis/home';
import './home.css';

const metas = [{
  name: 'tencent im online',
  content: 'tencent im online',
}];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      page: 1,
      pageSize: 10,
      dataSource: [],
      total: 0,
    };
  }

  componentWillMount() {
    this.getList();
  }

  componentDidMount() {
    this.schedule = NodeSchedule.scheduleJob('8 */1 * * * *', () => {
      this.getList();
    });
  }

  componentUnMount() {
    if (this.schedule) {
      this.schedule = null;
    }
  }

  getList = (page = 1, pageSize = 10) => {
    const startIndex = (page - 1) * pageSize;
    const maxResults = pageSize;

    const params = {
      sort: '-id',
      startIndex,
      maxResults,
    };

    HomeAPI.list(params).then(({ headers, data }) => {
      const total = +headers['x-content-record-total'];
      this.setState({
        page,
        pageSize,
        total,
        dataSource: data,
      });
    }).catch((error) => {
      this.setState({
        error,
      });
    });
  }

  onPageChanged = (page = 1, pageSize = 10) => {
    this.getList(page, pageSize);
  };

  render() {
    const { page, pageSize, total, dataSource } = this.state;
    return (
      <div className="wrapper-content">
        <Helmet title="首页" metas={metas} />
        <ImOnlineTable
          page={page}
          pageSize={pageSize}
          total={total}
          dataSource={dataSource}
          onChange={this.onPageChanged}
        />
      </div>
    );
  }
}

export default Home;
