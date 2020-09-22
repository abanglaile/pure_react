import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import *as action from '@/Action/index'
import { Icon, Popconfirm, Button, Modal, Table, Input, Select, message  } from 'antd'
import Highlighter from 'react-highlight-words';
const Option = Select.Option;

class groupManager extends React.Component{
    constructor(props){
        super();
        this.state = { visible : false, school_id : null, 
            searchText: '', filtered: false, 
            selected_teacher : [], editingKey: '',isOnChange : false,
            groupName : '',  groupType : '', groupLabel : undefined,
            groupTeacher: [],
        };
    }

    componentDidMount(){
        const { schoolId } = this.props;
        this.setState({ school_id : schoolId });
        console.log("schoolId:",schoolId);
        this.props.getGroupTable(schoolId);
        this.props.getGroupOptionData(schoolId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.schoolId !== this.state.school_id) {
            this.setState({ school_id: nextProps.schoolId },
                () => {this.props.getGroupTable(this.state.school_id);
                    this.props.getGroupOptionData(this.state.school_id)
                }
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

    createNewGroup(){
        const { groupName, groupType, groupLabel, groupTeacher } = this.state;
        const { schoolId } = this.props; 
        var new_group = {
            group_name : groupName,
            school_id : schoolId,
            group_type : groupType,
            course_label : groupLabel,
        };
        console.log("new_group:",JSON.stringify(new_group));
        if(groupName && groupType && groupLabel && groupTeacher[0]){
            this.props.addNewGroup(new_group, groupTeacher);
            this.setState({
              visible: false,
              groupName : '',
              groupType : '',
              groupLabel : undefined,
              groupTeacher: [],
            });
        }else{
            message.warning('请确认信息是否填写完整！');
        }
    }

    renderNewGroup(){
        const { course_option, teacher_option } = this.props;
        const { groupName, groupType, groupLabel, groupTeacher } = this.state;
        const courseOption = course_option.map((item) => <Option value={item.course_label}>{item.course_label_name}</Option>)
        const teacherOption = teacher_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>);  
        return (
          <Modal title="新建班级分组" onOk={(e) => this.createNewGroup()}
            onCancel={e => this.setState({visible: false,groupName : '',groupType : '',groupLabel : undefined,groupTeacher: []})}
            okText="新建"
            cancelText="取消"
            visible={this.state.visible} width={500} style={{height:400} }>
            <div>
                <Input 
                    placeholder="请输入分组名称"
                    value={groupName}
                    onChange={(e) => this.setState({groupName : e.target.value})} />
            </div>
            <div style={{marginTop: 15}}>    
                <Input 
                    style={{ width: 216 }}
                    placeholder="请输入分组类型"
                    value={groupType}
                    onChange={(e) => this.setState({groupType : e.target.value})} />

                <Select
                    placeholder="请选择分组科目"
                    optionFilterProp="children"
                    allowClear={true}
                    value={groupLabel}
                    style={{ marginLeft: 20, width: 216 }}
                    onChange={(value) => this.setState({groupLabel: value})}
                >
                    {courseOption}
                </Select>
            </div>
            <div style={{marginTop: 15}}> 
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择负责分组的老师"
                    value={groupTeacher}
                    onChange={(value) => this.setState({groupTeacher: value})}
                >
                    {teacherOption}
                </Select>
            </div>
          </Modal>
        )
    }

    teacherChange(value){
        console.log("teacherChange:",value);
        this.setState({selected_teacher : value, isOnChange : true});
    }

    isEditing(index){
        return index === this.state.editingKey;
    }

    updateOK(group_id,index){
        const { selected_teacher, school_id ,isOnChange } = this.state;
        // console.log("selected_teacher:",JSON.stringify(selected_teacher));
        // console.log("isOnChange:",isOnChange);
        if(isOnChange){
            this.props.updateGroupTeacher(school_id,selected_teacher,group_id,index);
        }
        this.setState({editingKey: '', selected_teacher : [], isOnChange: false});
    }

    selectCancel(){
        this.setState({editingKey: '', selected_teacher : [], isOnChange: false});
    }

    render(){
        const { groupData, teacher_option } = this.props;
        // console.log('groupData:',JSON.stringify(groupData));
        const teacherOption = teacher_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>);  
        const { visible } = this.state;

        this.columns = [{
            title: '分组id',
            dataIndex: 'group_id',
            width: '10%',
            key: 'group_id',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.group_id - b.group_id,
        }, {
            title: '分组名称',
            dataIndex: 'group_name',
            width: '25%',
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
                var indexs = record.group_name.indexOf(value);
                return (indexs >= 0 ? true : false);
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => {this.searchInput.focus();});
                }
            },
            render: text => (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={[this.state.searchText]}
                  autoEscape
                  textToHighlight={text.toString()}
                />
            ),
        }, {
            title: '分组类型',
            dataIndex: 'group_type',
            width: '10%',
        }, {
            title: '科目',
            dataIndex: 'course_label_name',
            width: '10%',
        }, {
            title: '负责老师',
            dataIndex: 'teacher_group',
            width: '35%',
            render: (text, record, index) => {
                // console.log("text:",JSON.stringify(text));
                var { editingKey } = this.state;
                const editable = this.isEditing(index);
                return(
                    <div>
                        {editable ? (
                            <div>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Please select"
                                    defaultValue={text[0].teacher_id ? text.map(e => (e.teacher_id).toString()) : []}
                                    onChange={(value,option) => this.teacherChange(value,option)}
                                >
                                    {teacherOption}
                                </Select>
                                <div style={{marginTop: 5}}>
                                    <a onClick={() => this.updateOK(record.group_id,index)}>确定</a>
                                    <a onClick={() => this.selectCancel()} style={{marginLeft: 10}}>取消</a> 
                                </div>
                            </div>
                        ) : (
                            <a disabled={editingKey !== ''} onClick={() => this.setState({ editingKey: index })}>
                                {text.map(e => <span>{e.realname}&nbsp;&nbsp;</span>)}
                            </a>
                        )}
                    </div>
                );
            },
        },{
            title: '操作',
            dataIndex: 'action',
            render: (text, record,index) => {
                return(
                    <a disabled={true}>
                        <Popconfirm title = "确定删除?" onConfirm = {() => this.props.delOneGroup(record.group_id,index)} >
                            <Icon type="delete"/>
                        </Popconfirm >
                    </a>
                );
            },
        }];

    
      return(
        <div>
            <div style={{marginBottom:"10px"}}>
            <Button 
                type="primary"  
                onClick={() => this.setState({visible: true})}
            >
                <Icon type="plus" />添加分组
            </Button>
            </div>
            {this.renderNewGroup()}
            < Table 
                columns = { this.columns } 
                dataSource = { groupData }
            /> 
        </div>   
      );
    }
}

export default connect(state => {
    const { schoolId, groupData, teacher_option, course_option } = state.managerData.toJS();
    return {
      schoolId: schoolId,
      groupData: groupData,
      teacher_option: teacher_option,
      course_option: course_option,
    }
}, action)(groupManager);