/**
 * Notes: 兼职实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class LostModel extends BaseProjectModel {

}

// 集合名
LostModel.CL = BaseProjectModel.C('lost');

LostModel.DB_STRUCTURE = {
	_pid: 'string|true',

	LOST_ID: 'string|true',

	LOST_STATUS: 'int|true|default=1|comment=状态 0=仅自己可见,1=正常',

	LOST_CATE_ID: 'string|true|default=0|comment=分类',
	LOST_CATE_NAME: 'string|false|comment=分类冗余',
	LOST_ORDER: 'int|true|default=9999',
	LOST_VOUCH: 'int|true|default=0',

	LOST_USER_ID: 'string|true|comment=用户ID',

	LOST_DAY: 'string|false|comment=日期',

	LOST_FORMS: 'array|true|default=[]',
	LOST_OBJ: 'object|true|default={}',

	LOST_FAV_CNT: 'int|true|default=0',
	LOST_FAV_LIST: 'array|true|default=[]',
	LOST_VIEW_CNT: 'int|true|default=0',
	LOST_LIKE_CNT: 'int|true|default=0',
	LOST_LIKE_LIST: 'array|true|default=[]',
	LOST_COMMENT_CNT: 'int|true|default=0',

	LOST_QR: 'string|false',

	LOST_ADD_TIME: 'int|true',
	LOST_EDIT_TIME: 'int|true',
	LOST_ADD_IP: 'string|false',
	LOST_EDIT_IP: 'string|false',

};

// 字段前缀
LostModel.FIELD_PREFIX = "LOST_";

module.exports = LostModel;