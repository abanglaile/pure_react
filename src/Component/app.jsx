import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import { connect } from 'react-redux'
import *as action from '@/Action/index'

import { Link } from 'react-router'

const SubMenu = Menu.SubMenu
const { Header, Sider, Content } = Layout

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1236732_nfjyznqs3qm.js',
});

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: true
    }
  }

  // toggle = () => {
  //   this.setState({ collapsed: !this.state.collapsed })
  // }
  render () {
    return (
      <Layout>
        <Header className="header">
          {/* <div style={{ width: 145, height: 31, margin: '16px 28px 16px 0', float: 'left'}} /> */}
          <IconFont style={{fontSize: 30, margin: '16px 138px 16px 0', float: 'left'}} type="icon-tubiaozhizuomobanyihuifu-" />
          <Menu
            theme="dark"
            mode="horizontal"
            onClick={(e) => this.props.setSchoolId(e.key)}
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">喜悦-海珠分校</Menu.Item>
            <Menu.Item key="3">喜悦-越秀分校</Menu.Item>
            {/* <Menu.Item key="2">星海附中</Menu.Item> */}
          </Menu>
        </Header>
        <Layout>
          <Sider 
            width={200} 
            style={{ background: '#fff' }}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => { console.log("broken:",broken); }}
            onCollapse={(collapsed, type) => { console.log("collapsed, type:",collapsed, type); }}
          >
            <Menu
              mode="inline"
              // defaultSelectedKeys={['1']}
              defaultOpenKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1">
                <Link to='/school-zq/teacher'>
                  <Icon type='user' />
                  <span>教师管理</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to='/school-zq/group'>
                  <Icon type='team' />
                  <span>分组管理</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to='/school-zq/contract'>
                  <Icon type='file-text' />
                  {/* <i className="iconfont icon-zuzhi"></i> */}
                  <span>合同管理</span>
                </Link>
              </Menu.Item>
              {/* <Menu.Item key="4">
                <Link to='/school-zq/student'>
                  <Icon type='user' />
                  <span>学生管理</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to='/school-zq/room'>
                  <Icon type='user' />
                  <span>课室管理</span>
                </Link>
              </Menu.Item> */}
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 350 }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default connect(state => {
  return {}
}, action)(App);
