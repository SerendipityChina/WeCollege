/**
 * Notes: 兼职实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class JobModel extends BaseProjectModel {

}

// 集合名
JobModel.CL = BaseProjectModel.C('job');

JobModel.DB_STRUCTURE = {
	_pid: 'string|true',

	JOB_ID: 'string|true',

	JOB_STATUS: 'int|true|default=1|comment=状态 0=仅自己可见,1=正常',

	JOB_CATE_ID: 'string|true|default=0|comment=分类',
	JOB_CATE_NAME: 'string|false|comment=分类冗余',
	JOB_ORDER: 'int|true|default=9999',
	JOB_VOUCH: 'int|true|default=0',

	JOB_USER_ID: 'string|true|comment=用户ID',

	JOB_DAY: 'string|false|comment=日期',

	JOB_FORMS: 'array|true|default=[]',
	JOB_OBJ: 'object|true|default={}',

	JOB_FAV_CNT: 'int|true|default=0',
	JOB_FAV_LIST: 'array|true|default=[]',
	JOB_VIEW_CNT: 'int|true|default=0',
	JOB_LIKE_CNT: 'int|true|default=0',
	JOB_LIKE_LIST: 'array|true|default=[]',
	JOB_COMMENT_CNT: 'int|true|default=0',

	JOB_QR: 'string|false',

	JOB_ADD_TIME: 'int|true',
	JOB_EDIT_TIME: 'int|true',
	JOB_ADD_IP: 'string|false',
	JOB_EDIT_IP: 'string|false',

};

// 字段前缀
JobModel.FIELD_PREFIX = "JOB_";

module.exports = JobModel;