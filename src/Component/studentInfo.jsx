import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Tabs, Breadcrumb, List, Avatar, Tag, Select, Form, Row, Col, Button, Spin } from 'antd';
import *as action from '@/Action/';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import moment from 'moment';

const { Footer, Content } = Layout;
const TabPane = Tabs.TabPane;

class studentInfo extends React.Component{
	constructor(props){
		super(props);
		this.state = { activeKey : '1',
            student_id : this.props.params.id,
            course_label : null,
            side_option : [{side:1,side_label:'表扬进步'},{side:0,side_label:'存在问题'}],
            query_course_label: undefined, kp_side:undefined,
            query_pf_label: undefined,pf_side:undefined,
		};
	}

	componentDidMount(){
        const {student_id} = this.state;
        if(student_id){
            this.props.getStuInfoById(student_id);
            this.props.getStuCourse(student_id);
            this.props.getPfLabelOptions();
            this.props.getStuPfCommentList(student_id,{});
            this.props.getStuKpCommentList(student_id,{});
        }
    }

	onTabChange(key){
        const {student_id} = this.state;
        this.setState({activeKey : key});
        // if(key == 2){
        //     this.props.getStuKpCommentList(student_id,{});
        // }
    }

    getTagColor(course_label){
        let tag_color = '';
        switch (course_label){
          case '1':
            tag_color = '#28b6b6';
            break;
          case '2':
            tag_color = '#fef001';
            break;
          case '3':
            tag_color = '#f56a00';
            break;
          case '4':
            tag_color = '#0ebec4';
            break;
          case '5':
            tag_color = '#3162e5';
            break;
          case '6':
            tag_color = '#eece2e';
            break;
          case '7':
            tag_color = '#ff9918';
            break;
          case '8':
            tag_color = '#ff4640';
            break;
          case '9':
            tag_color = '#d4b22a';
            break;
          case '10':
            tag_color = '#28d900';
            break;
          default:
            break;
        }
        return tag_color;
    }
    
    renderPfComment(){
        const {student_id, side_option, query_pf_label, pf_side} = this.state;
        const {stu_pfcomment_list, pf_label_options} = this.props;
        // console.log("pf_label_options:",JSON.stringify(pf_label_options));
        const pfLabelOption = pf_label_options.map((item) => <Option value={item.value}>{item.label}</Option>);
        const sideOption = side_option.map((item) => <Option value={item.side}>{item.side_label}</Option>);
        return (
            <div>
                <Form
                    style = {{
                        padding: "12px",
                        background: "#fbfbfb",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px"
                    }}
                    // layout="vertical"
                >
                    <Row type="flex" justify="space-around" align="middle">
                        <Col span={6}>
                            <Form.Item label={"效能标签"}>
                                <Select
                                    showSearch
                                    style={{ width: "50" }}
                                    placeholder="选择标签"
                                    optionFilterProp="children"
                                    value={query_pf_label}
                                    onChange={(value) => this.setState({query_pf_label: value})}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {pfLabelOption}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={"效能表现"}>
                                <Select
                                    showSearch
                                    style={{ width: "80" }}
                                    placeholder="选择表现情况"
                                    optionFilterProp="children"
                                    value={pf_side}
                                    onChange={(value) => this.setState({pf_side: value})}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {sideOption}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" onClick={() => this.props.getStuPfCommentList(student_id, {
                                pf_label:query_pf_label, 
                                side:pf_side,
                            })}>查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={() => this.handlePfReset()}>
                                重置
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <List
                    itemLayout="vertical"
                    // size="large"
                    style={{marginTop:'1rem'}}
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 6,
                    }}
                    dataSource={stu_pfcomment_list}
                    renderItem={item => (
                        <List.Item
                            key={item.comment_id}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={
                                    <div>
                                        <span>{item.realname}</span>
                                        <Tag 
                                            size = 'small'
                                            style={{marginLeft:'1rem'}}
                                            color={this.getTagColor(item.course_label)}
                                        >
                                            {item.course_label_name}
                                        </Tag>
                                    </div>
                                }
                                description={
                                    <div>
                                        <span style={{color : item.side? '#52c41a' : (item.side == 0) ? '#ff4d4f' : '#1890ff'}}>#{item.label_name}#</span>
                                        <span style={{marginLeft:'1rem'}}>{moment(item.comment_time).format("YYYY-MM-DD HH:mm")}</span>
                                    </div>
                                }
                            />
                            <div style={{marginLeft:'3rem'}}>
                                {item.pf_comment_content}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        );
    }

    handleReset(){
        this.setState({
            query_course_label: undefined,
            kp_side:undefined,
        });
    }

    handlePfReset(){
        this.setState({
            query_pf_label: undefined,
            pf_side:undefined,
        });
    }

    renderKpComment(){
        const {student_id, side_option, query_course_label, kp_side} = this.state;
        const {course_option, stu_kpcomment_list} = this.props;
        const courseOption = course_option.map((item) => <Option value={item.course_label}>{item.course_label_name}</Option>);
        const sideOption = side_option.map((item) => <Option value={item.side}>{item.side_label}</Option>);
        return (
            <div>
                <Form
                    style = {{
                        padding: "12px",
                        background: "#fbfbfb",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px"
                    }}
                    // layout="vertical"
                >
                    <Row type="flex" justify="space-around" align="middle">
                        <Col span={6}>
                            <Form.Item label={"学科"}>
                                <Select
                                    showSearch
                                    style={{ width: "50" }}
                                    placeholder="选择学科"
                                    optionFilterProp="children"
                                    value={query_course_label}
                                    onChange={(value) => this.setState({query_course_label: value})}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {courseOption}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={"知识点表现"}>
                                <Select
                                    showSearch
                                    style={{ width: "80" }}
                                    placeholder="选择表现情况"
                                    optionFilterProp="children"
                                    value={kp_side}
                                    onChange={(value) => this.setState({kp_side: value})}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {sideOption}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" onClick={() => this.props.getStuKpCommentList(student_id, {
                            course_label:query_course_label, 
                            side:kp_side,
                            })}>查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={() => this.handleReset()}>
                                重置
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <List
                    itemLayout="vertical"
                    // size="large"
                    style={{marginTop:'1rem'}}
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 6,
                    }}
                    dataSource={stu_kpcomment_list}
                    renderItem={item => (
                        <List.Item
                            key={item.comment_id}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={
                                    <div>
                                        <span>{item.realname}</span>
                                        <Tag 
                                            size = 'small'
                                            style={{marginLeft:'1rem'}}
                                            color={this.getTagColor(item.course_label)}
                                        >
                                            {item.course_label_name}
                                        </Tag>
                                    </div>
                                }
                                description={
                                    <div>
                                        <span style={{color : item.side? '#52c41a' : '#ff4d4f'}}>#{item.kpname}#</span>
                                        <span style={{marginLeft:'1rem'}}>{moment(item.comment_time).format("YYYY-MM-DD HH:mm")}</span>
                                    </div>
                                }
                            />
                            <div style={{marginLeft:'3rem'}}>
                                {item.kp_comment_content}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        );
       
    }

	render(){
		const {activeKey,student_id} =this.state;
		const {student_name, group_name,isFetching} = this.props;
		console.log("student_name",student_name);
		if(student_name){
			return(
                <div>
                    <Breadcrumb style={{ margin: '12px 0' }} separator=">">
                        <Breadcrumb.Item><span><Link to="/school-zq/student">学生管理</Link></span></Breadcrumb.Item>
                        <Breadcrumb.Item>{student_name}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div>
                    <Spin spinning={isFetching} >
                    <Tabs size="large" onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
                        <TabPane tab="效能点评" key="1">{this.renderPfComment()}</TabPane>
                        <TabPane tab="知识点评" key="2">{this.renderKpComment()}</TabPane>
                    </Tabs>
                    </Spin>
                    </div>
                </div>
				// <Layout>
                //     <Content style={{ padding: '0 24px' }}>
                //         <Breadcrumb style={{ margin: '12px 0' }} separator=">">
                //             <Breadcrumb.Item><span><Link to="/school-zq/student">学生管理</Link></span></Breadcrumb.Item>
                //             <Breadcrumb.Item>{student_name}</Breadcrumb.Item>
                //         </Breadcrumb>
                //         <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                //         <Spin spinning={isFetching} >
                //         <Tabs size="large" onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
                //             <TabPane tab="课堂表现" key="1">{this.renderPfComment()}</TabPane>
                //             <TabPane tab="知识点点评" key="2">{this.renderKpComment()}</TabPane>
                //         </Tabs>
                //         </Spin>
                //         </div>
                //     </Content>
                //     <Footer style={{ textAlign: 'center' }}>
                //         Ant Design ©2021 Created by Bourne
                //     </Footer>
				// </Layout>
			);
		}else{
			return null;
		}
	}
}

export default connect(state => {
  const { student_info, stu_pfcomment_list, stu_kpcomment_list, course_data, pf_label_options, isFetching } = state.managerData.toJS();	
  return {
	  student_name : student_info ? student_info.realname : null,
      group_name : student_info ? student_info.group_name : null,
      stu_pfcomment_list : stu_pfcomment_list,
      stu_kpcomment_list : stu_kpcomment_list,
      course_option : course_data,
      pf_label_options : pf_label_options,
      isFetching : isFetching,
  }
}, action)(studentInfo);



