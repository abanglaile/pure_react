import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import *as action from '@/Action/index'
import { Icon, Popover, Button, Table, Input, InputNumber, Modal,
        List, Tag, Form, Select, Row, Col, DatePicker, message, Tooltip} from 'antd'
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import debounce from 'lodash/debounce';

const {Option}  = Select;

class contractManager extends React.Component{
    constructor(props){
        super(props);
        this.state = { school_id : null, 
            searchText: '', filtered: false, timeVisible: false, 
            conVisible: false, hisVisible:false, editingKey: '', label: '', num: null,
            start_time: undefined, end_time: undefined,stu_group_id: null,
            //合同modual
            student_id: undefined, group_id: undefined, guide_con: 0,class_con: 0,
            discount: 100, fee: null, payment_time: undefined,
        };
        // console.log("this.props:",JSON.stringify(this.props));
        this.searchStuName = debounce(this.props.searchStuName, 500);
    }

    componentDidMount(){
        const { schoolId } = this.props;
        this.setState({ school_id : schoolId });
        this.props.getContractTable(schoolId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.schoolId !== this.state.school_id) {
            this.setState({ school_id: nextProps.schoolId },
                () => this.props.getContractTable(this.state.school_id)
            );
        }
    }

    handleSearch(selectedKeys, confirm){
		confirm();
		this.setState({ searchText: selectedKeys[0] });
    }
    
    handleReset(clearFilters){
        clearFilters();
        this.setState({ searchText: '' });
    }

    isGuideEditing(index){
        const { label, editingKey } = this.state;
        return (index === editingKey && label == 'guide');
    }

    isClassEditing(index){
        const { label, editingKey } = this.state;
        return (index === editingKey && label == 'class');
    }

    updateOK(stu_group_id, student_id, index){
        const { num, label } = this.state;
        if(num != null){
            this.props.updateGroupHour(stu_group_id, student_id, num, index, label, this.props.schoolId);
        }
        this.setState({editingKey: '', num : null, label: ''});
    }

    onGuideModal(stu_group_id){
        this.props.getConsumeLesson(stu_group_id, 'guide', {});
        this.setState({timeVisible: true, stu_group_id: stu_group_id});
    }

    onClassModal(stu_group_id){
        this.props.getConsumeLesson(stu_group_id, 'class', {});
        this.setState({timeVisible: true, stu_group_id: stu_group_id});
    }

    onContractModal(stu_group_id, student_id){
        this.props.getHistoryContract(stu_group_id, student_id);
        this.setState({hisVisible: true});
    }

    createNewContract(){
        const { student_id, group_id, guide_con, class_con, discount, fee, payment_time } = this.state;
        var new_contract = {
            student_id : student_id,
            stu_group_id : group_id,
            guide_min : guide_con,
            class_min : class_con,
            discount: discount,
            fee: fee,
            payment_time: payment_time,
        };
        if(student_id && group_id && fee && payment_time){
            this.props.addNewContract(new_contract,this.props.schoolId);
            this.setState({
                conVisible: false,
                student_id:undefined,
                group_id:undefined,
                guide_con:0,
                class_con:0,
                discount:100,
                fee:null,
                payment_time:undefined,
            });
        }else{
            message.warning('请确认信息是否填写完整！');
        }
    }

    renderNewContract(){
        const { search_stu_name, stu_group_option } = this.props;
        const { student_id, group_id, guide_con, class_con, discount, fee, payment_time } = this.state;
        const stuGroupOption = stu_group_option ? stu_group_option.map((item) => <Option value={item.stu_group_id}>{item.group_name}</Option>) : null;
        const student_options = search_stu_name ? search_stu_name.map(d => <Option key={d.student_id}>{d.realname}</Option>) : null;
        return (
            <Modal title="新增合同" onOk={(e) => this.createNewContract()}
                onCancel={e => 
                    this.setState({conVisible: false,student_id:undefined,payment_time:undefined,
                    group_id:undefined,guide_con:0,class_con:0,discount:100,fee:null})
                }
                okText="新增"
                cancelText="取消"
                visible={this.state.conVisible} width={500} style={{height:400} }
            >
                <div>
                    <Select
                        placeholder={"选择合同学生"}
                        style={{ width: 180 }}
                        value={student_id}
                        showSearch
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        autoFocus={true}
                        onSearch={(input) => this.searchStuName(input)}
                        onSelect={(value, option) => {this.setState({student_id: value});this.props.getStuGroup(value,this.state.school_id);}}
                        notFoundContent={null}
                    >
                        {student_options}  
                    </Select>    
                    <Select
                        placeholder={"选择合同对应分组"}
                        optionFilterProp="children"
                        allowClear={true}
                        value={group_id}
                        style={{ marginLeft: 70, width: 180 }}
                        onChange={(value) => this.setState({group_id: value})}
                    >
                        {stuGroupOption}
                    </Select> 
                </div>
                <div style={{marginTop: '1.2rem'}}>    
                    <Form layout="inline">
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={12} sm={24}>
                                <Form.Item label={"导学(分钟)"}>
                                    <InputNumber  min={0}
                                        value={guide_con} 
                                        onChange={(value) => this.setState({guide_con:value})}/>
                                </Form.Item>
                            </Col>

                            <Col md={12} sm={24}>
                                <Form.Item label={"函授(分钟)"}>
                                    <InputNumber  min={0} 
                                        value={class_con} 
                                        onChange={(value) => this.setState({class_con:value})}/>
                                </Form.Item>
                            </Col>            
                        </Row>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }} 
                            style={{marginTop: "1rem"}}>
                            <Col md={12} sm={24}>
                                <Form.Item label={"合同(折扣)"}>
                                    <InputNumber  min={0}
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace('%', '')}
                                        value={discount} 
                                        onChange={(value) => this.setState({discount:value})}/>
                                </Form.Item>
                            </Col>

                            <Col md={12} sm={24}>
                                <Form.Item label={"合同(金额)"}>
                                    <InputNumber  min={0}
                                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                                        value={fee} 
                                        onChange={(value) => this.setState({fee:value})}/>
                                </Form.Item>
                            </Col>            
                        </Row>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }} 
                            style={{marginTop: "1rem"}}>
                            <Col md={16} sm={24}>
                                <Form.Item label={"付款(日期)"}>
                                    <DatePicker
                                        placeholder={"请选择合同时间"}
                                        value={payment_time}
                                        onChange={(value,dateString) => {this.setState({payment_time: value})}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        )
    }

    renderConsumedModal(){
        const { consumeLesson, total_time } = this.props;
        const { label, start_time, end_time, stu_group_id } = this.state;
        return (
            <Modal title={(label=='guide')? '导学(已消费)' : '函授(已消费)' } 
                onCancel={e => this.setState({timeVisible: false,label:'',stu_group_id:null})}
                footer={null}
                visible={this.state.timeVisible} width={800} style={{height:400} }>
                <div>
                    <Form
                        style = {{
                            padding: "18px",
                            background: "#fbfbfb",
                            border: "1px solid #d9d9d9",
                            borderRadius: "6px"
                        }}
                        layout="inline"
                    >
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={12} sm={24}>
                            <Form.Item label={"开始时间"}>
                                <DatePicker
                                locale={locale}
                                value={start_time}
                                style={{ width: 170 }}
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                placeholder={"开始时间"}
                                onChange={(value,dateString) => {this.setState({start_time: value})}}
                                /> 
                            </Form.Item>
                            </Col>

                            <Col md={12} sm={24}>
                            <Form.Item label={"结束时间"}>
                                <DatePicker
                                locale={locale}
                                value={end_time}
                                style={{ width: 170 }}
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                placeholder={"结束时间"}
                                onChange={(value,dateString) => {this.setState({end_time: value})}}
                                /> 
                            </Form.Item>
                            </Col>            
                        </Row>
                        <Row style={{marginTop: "1rem", marginRight: "7%"}}>  
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit" onClick={() => this.props.getConsumeLesson(stu_group_id, label, {
                                    start_time:start_time ? start_time.format("YYYY-MM-DD HH:mm") : null, 
                                    end_time:end_time ? end_time.format("YYYY-MM-DD HH:mm") : null, 
                                })}>查询</Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => {this.setState({ start_time: undefined, end_time: undefined});this.props.getConsumeLesson(stu_group_id, label, {})}}>
                                    重置
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div style={{marginTop:'10px'}}>
                    共&nbsp;<span style={{color:'red'}}>{consumeLesson.length ? consumeLesson.length : 0}</span>&nbsp;节课，合计&nbsp;<span style={{color:'red'}}>{total_time}</span>&nbsp;分钟，<span style={{color:'red'}}>{(total_time/60).toFixed(2)}</span>&nbsp;小时
                </div>
                <List
                    itemLayout="horizontal"
                    pagination={{
                        pageSize: 6,
                    }}
                    dataSource={consumeLesson}
                    renderItem={(item, index) => (
                        <List.Item
                            key={item.lesson_id}
                        >
                            <List.Item.Meta
                                title={
                                    <div>
                                        <span style={{color:'#1890ff'}}>{item.group_name}</span>
                                        <span style={{marginLeft:'15px',color:'#bfbfbf'}}>
                                            {moment(item.start_time).format("YYYY-MM-DD HH:mm") + "  -  " + moment(item.end_time).format("HH:mm")}
                                        </span>
                                    </div>}
                                description={
                                    <div>
                                        <span>老师：{item.teacher_name}</span>
                                        {item.assistant_name ? 
                                        <span style={{marginLeft:'15px'}}>助教：{item.assistant_name}</span>
                                        : ''}
                                    </div>
                                }
                            />
                            <div style={{marginLeft:'48px'}}>
                                <Tag style={{marginRight: 10}} color="blue">{item.room_name}</Tag>
                            </div>
                        </List.Item>
                    )}
                />
            </Modal>
        );
    }

    renderHistoryModal(){
        const { his_contract_list, total_fee } = this.props;
        return(
            <Modal title={'历史合同'} 
                onCancel={e => this.setState({hisVisible: false})}
                footer={null}
                visible={this.state.hisVisible} width={600} style={{height:400} }
            >
                <div>
                    共&nbsp;<span style={{color:'red'}}>{his_contract_list.length ? his_contract_list.length : 0}
                    </span>&nbsp;张合同，总金额&nbsp;<span style={{color:'red'}}>{total_fee}</span>&nbsp;元
                </div>
                <List
                    itemLayout="horizontal"
                    pagination={{
                        pageSize: 5,
                    }}
                    dataSource={his_contract_list}
                    renderItem={(item, index) => (
                        <List.Item
                            key={item.id}
                        >
                            <List.Item.Meta
                                    // <Icon type="account-book" />
                                title={
                                    <div>
                                        <span style={{color:'#1890ff'}}>{item.group_name}</span>
                                        <span style={{marginLeft:'20px',color:'#bfbfbf'}}>
                                            <Icon style={{color: '#a6a6a6', marginLeft:10, marginRight: 10}} type="calendar" theme="outlined" />
                                            {moment(item.payment_time).format("YYYY-MM-DD")}
                                        </span>
                                    </div>
                                }
                                description={
                                    <div>
                                        <span>合同金额：</span>
                                        <span style={{color:'red'}}>{item.fee}</span>元
                                        <span style={{marginLeft:'20px'}}>导学：{(item.guide_min/60).toFixed(2)} 小时</span>
                                        <span style={{marginLeft:'20px'}}>函授：{(item.class_min/60).toFixed(2)} 小时</span>
                                    </div>
                                }
                            />
                            <div style={{marginLeft:'48px'}}>
                                <Tag style={{marginRight: 10}} color="blue">{item.discount}%</Tag>
                            </div>
                        </List.Item>
                    )}
                />
            </Modal>
        );
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={ele => this.searchInput = ele}
              placeholder="输入关键字"
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        onFilter: (value, record) => {
            // console.log("record:",JSON.stringify(record));
            if(record[dataIndex]){
                var indexs = record[dataIndex].indexOf(value);
                return (indexs >= 0 ? true : false);
            }else{
                return false;
            }
        },
        onFilterDropdowntimeVisibleChange: (timeVisible) => {
            if (timeVisible) {
                setTimeout(() => {this.searchInput.focus();});
            }
        },
        render: text => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ),
    });

    render(){
        const { contractData } = this.props;

        this.columns = [{
            title: '学生',
            dataIndex: 'realname',
            width: '4%',
            ...this.getColumnSearchProps('realname'),
            render: (text, record, index) => {
                if(text){
                    return(
                        <div>
                            <Popover content={this.props.code} title="邀请码" trigger="click">
                                <a onClick={() => this.props.getCodeByStudentid(record.student_id)}>{text}</a>
                            </Popover>
                        </div>
                    );
                }else{
                    return '';
                }
            },
        }, {
            title: '参与课程',
            dataIndex: 'group_name',
            width: '8%',
            ...this.getColumnSearchProps('group_name'),
            render: (text, record, index) => {
                return(
                    <div>
                        <Tooltip placement="top" title={'id: '+ record.stu_group_id}>
                            <a onClick={() => this.onContractModal(record.stu_group_id,record.student_id)}>{text}</a>
                        </Tooltip>
                    </div>
                );
            },
        }, {
            title: '类别',
            dataIndex: 'group_type',
            width: '3%',
            ...this.getColumnSearchProps('group_type'),
        },  {
            title: '导学(合同)',
            dataIndex: 'guide_min',
            width: '5%',
            render: (text, record, index) => {
                var { editingKey, label } = this.state;
                const editable = this.isGuideEditing(index);
                return(
                    <div>
                        {editable ? (
                            <div>
                                <InputNumber  min={0} formatter={value => `${value}m`} parser={value => value.replace('m', '')} defaultValue={text} onChange={(value) => this.setState({num:value})}/>
                                <div style={{marginTop: 5}}>
                                    <a onClick={() => this.updateOK(record.stu_group_id,record.student_id,index)}>确定</a>
                                    <a onClick={() => this.setState({editingKey: '',label: ''})} style={{marginLeft: 10}}>取消</a> 
                                </div>
                            </div>
                        ) : (
                            // <a disabled={editingKey !== ''} onClick={() => this.setState({ editingKey: index, label: 'guide' })}>
                            //     <span>{(text/60).toFixed(1)}</span>
                            // </a>
                            <span>{(text/60).toFixed(2)}</span>
                        )}
                    </div>
                );
            },
        }, {
            title: '函授(合同)',
            dataIndex: 'class_min',
            width: '5%',
            render: (text, record, index) => {
                var { editingKey, label } = this.state;
                const editable = this.isClassEditing(index);
                return(
                    <div>
                        {editable ? (
                            <div>
                                <InputNumber  min={0} formatter={value => `${value}m`} parser={value => value.replace('m', '')} defaultValue={text} onChange={(value) => this.setState({num:value})}/>
                                <div style={{marginTop: 5}}>
                                    <a onClick={() => this.updateOK(record.stu_group_id,record.student_id,index)}>确定</a>
                                    <a onClick={() => this.setState({editingKey: '',label: ''})} style={{marginLeft: 10}}>取消</a> 
                                </div>
                            </div>
                        ) : (
                            // <a disabled={editingKey !== ''} onClick={() => this.setState({ editingKey: index, label: 'class' })}>
                            //     <span>{(text/60).toFixed(1)}</span>
                            // </a>
                            <span>{(text/60).toFixed(2)}</span>
                        )}
                    </div>
                );
            },
        }, {
            title: '导学(消费)',
            dataIndex: 'consume_guide_min',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <a onClick={() => {this.setState({label:'guide'});this.onGuideModal(record.stu_group_id)}}>
                        {/* {text} */}
                        {(text/60).toFixed(2)}
                    </a>
                );
            },
        }, {
            title: '函授(消费)',
            dataIndex: 'consume_class_min',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <a onClick={() => {this.setState({label:'class'});this.onClassModal(record.stu_group_id)}}>
                        {/* {text} */}
                        {(text/60).toFixed(2)}
                    </a>
                );
            },
        },{
            title: '导学(剩余)',
            dataIndex: 'remain_guide_min',
            width: '5%',
            sorter: (a, b) => a.remain_guide_min - b.remain_guide_min,
            render: (text, record, index) => {
                return(
                    <div style={{color:text >= 0? 'green' : 'red'}}>
                        <span>{(text/60).toFixed(2)}</span>
                    </div>
                );
            },
        }, {
            title: '函授(剩余)',
            dataIndex: 'remain_class_min',
            width: '5%',
            sorter: (a, b) => a.remain_class_min - b.remain_class_min,
            render: (text, record, index) => {
                return(
                    <div style={{color:text >= 0? 'green' : 'red'}}>
                        <span>{(text/60).toFixed(2)}</span>
                    </div>
                );
            },
        }];

    
      return(
         <div>
            <div style={{marginBottom:"10px"}}>
                <Button 
                    type="primary"  
                    onClick={() => this.setState({conVisible: true})}
                >
                    <Icon type="plus" />新增合同
                </Button>
            </div>
            {this.renderNewContract()}
            {this.renderHistoryModal()}
            <div>
                < Table 
                    columns = { this.columns } 
                    dataSource = { contractData }
                /> 
                {this.renderConsumedModal()}
            </div>  
        </div>   
      );
    }
}

export default connect(state => {
    const { schoolId, contractData, consumeLesson, total_time, code ,
        search_stu_name, stu_group_option, his_contract_list, total_fee} = state.managerData.toJS();
    // console.log("contractData:",JSON.stringify(contractData));
    return {
      schoolId: schoolId,
      contractData: contractData,
      consumeLesson: consumeLesson,
      total_time: total_time,
      search_stu_name: search_stu_name,
      stu_group_option: stu_group_option,
      his_contract_list: his_contract_list,
      total_fee: total_fee,
      code: code,
    }
}, action)(contractManager);