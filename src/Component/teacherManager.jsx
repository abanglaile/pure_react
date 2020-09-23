import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import *as action from '@/Action/index'
import { List, Avatar, Icon, Popover, Card, Spin } from 'antd'
const { Meta } = Card;

class teacherManager extends React.Component{
    constructor(props){
        super();
        this.state = { school_id : null };
    }

    componentDidMount(){
        const { schoolId } = this.props;
        this.setState({ school_id : schoolId });
        // console.log("school_id:",school_id);
        this.props.getTeacherList(schoolId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.schoolId !== this.state.school_id) {
            this.setState({ school_id: nextProps.schoolId },
                () => this.props.getTeacherList(this.state.school_id)
            );
        }
    }

    render(){
      var { teacherData, isFetching } = this.props;
    
      return( 
       <div>
            {/* {
            isFetching ? 
            <div style={{textAlign: 'center',width:'90%', height:'400'}}>
                <Spin tip="Loading..." size="large" />
            </div>
             : ''} */}
            <div>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 3,
                    }}
                    dataSource={teacherData}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                actions={[<Icon type="edit" />, <Icon type="delete" />]}
                            >
                                <Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<a href="#">{item.realname}</a>}
                                    description={
                                        <Popover 
                                            content={ 
                                                <div style={{width:320}}>{item.group.map((g_item) => <span>{g_item.group_id}:{g_item.group_name},&nbsp;</span>)}</div>
                                            }
                                        >
                                            <span>带<span style={{fontSize:'1rem',color:'#597ef7'}}>{item.group.length}</span>个班组</span>
                                        </Popover>
                                    }
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            </div>      
        </div>);
    }
}

export default connect(state => {
    const { schoolId, teacherData, isFetching } = state.managerData.toJS();
    // console.log("isFetching:",isFetching);
    // console.log("teacherData:",JSON.stringify(teacherData));
    return {
      schoolId: schoolId,
      teacherData: teacherData,
      isFetching: isFetching,
    }
}, action)(teacherManager);