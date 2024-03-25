/**
 * Notes: 兼职实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class LeaveModel extends BaseProjectModel {

}

// 集合名
LeaveModel.CL = BaseProjectModel.C('leave');

LeaveModel.DB_STRUCTURE = {
	_pid: 'string|true',

	LEAVE_ID: 'string|true',

	LEAVE_STATUS: 'int|true|default=1|comment=状态 0=仅自己可见,1=正常',

	LEAVE_CATE_ID: 'string|true|default=0|comment=分类',
	LEAVE_CATE_NAME: 'string|false|comment=分类冗余',
	LEAVE_ORDER: 'int|true|default=9999',
	LEAVE_VOUCH: 'int|true|default=0',

	LEAVE_USER_ID: 'string|true|comment=用户ID',

	LEAVE_DAY: 'string|false|comment=日期',

	LEAVE_FORMS: 'array|true|default=[]',
	LEAVE_OBJ: 'object|true|default={}',

	LEAVE_FAV_CNT: 'int|true|default=0',
	LEAVE_FAV_LIST: 'array|true|default=[]',
	LEAVE_VIEW_CNT: 'int|true|default=0',
	LEAVE_LIKE_CNT: 'int|true|default=0',
	LEAVE_LIKE_LIST: 'array|true|default=[]',
	LEAVE_COMMENT_CNT: 'int|true|default=0',

	LEAVE_QR: 'string|false',

	LEAVE_ADD_TIME: 'int|true',
	LEAVE_EDIT_TIME: 'int|true',
	LEAVE_ADD_IP: 'string|false',
	LEAVE_EDIT_IP: 'string|false',

};

// 字段前缀
LeaveModel.FIELD_PREFIX = "LEAVE_";

module.exports = LeaveModel;