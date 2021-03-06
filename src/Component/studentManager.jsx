import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import *as action from '@/Action/index'
import { List, Avatar, Icon, Card, Input, Button, Table, Popover ,Spin } from 'antd'
import Highlighter from 'react-highlight-words';
const { Meta } = Card;
const { Search } = Input;

class studentManager extends React.Component{
    constructor(props){
        super();
        this.state = {
            searchText: '', filtered: false, 
        };
    }

    componentDidMount(){
        const { schoolId } = this.props;
        this.props.getStudentDataBySchoolid(schoolId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.schoolId !== this.state.school_id) {
            this.setState({ school_id: nextProps.schoolId },
                () => this.props.getStudentDataBySchoolid(this.state.school_id)
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

    render(){
    var { student_list, isFetching } = this.props;

    this.columns = [{
        title: '头像',
        dataIndex: 'avatar',
        width: '15%',
        render: (text, record, index) => {
            return(
                <Avatar src={text} />
                // <div>
                //     <Popover content={this.props.code} title="邀请码" trigger="click">
                //         <a onClick={() => this.props.getCodeByStudentid(record.student_id)}>
                //             <Avatar src={text} />
                //         </a>
                //     </Popover>
                // </div>
            );
        },
    },  {
        title: '姓名',
        dataIndex: 'realname',
        width: '15%',
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
            // console.log('record.realname:',record,record.realname);
            if(record.realname){
                var indexs = record.realname.indexOf(value);
                return (indexs >= 0 ? true : false);
            }else{
                return false;
            }
            
        },
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => {this.searchInput.focus();});
            }
        },
        render: (text, record, index) => {
            let urlstr = "/school-zq/student_info/"+record.student_id;
            return(
                <div>
                    <Link to={urlstr}>
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[this.state.searchText]}
                            autoEscape
                            textToHighlight={text}
                        />
                    </Link>
                </div>
            );
        },
    },{
        title: '参与课程',
        dataIndex: 'group_info',
        width: '70%',
        render: (text, record, index) => {
            return(
                <div>
                    {text.map(item => (
                        <span style={{marginRight:'2rem'}}>
                            {item.group_name}
                        </span>
                    ))}
                </div>
            );
        },
    }];
    
      return( 
        <div>
            <Spin spinning={isFetching} >
            < Table 
                columns = { this.columns } 
                dataSource = { student_list }
            /> 
            </Spin>
        </div>   
        );
    }
}

export default connect(state => {
    const { schoolId, studentData, code, isFetching } = state.managerData.toJS();
    // console.log("studentData：",JSON.stringify(studentData));
    return {
      schoolId: schoolId,
      student_list: studentData,
      code: code,
      isFetching: isFetching,
    }
}, action)(studentManager);