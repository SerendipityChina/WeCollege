/**
 * Notes: 表白墙实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-05-24 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class BoardModel extends BaseProjectModel {

}

// 集合名
BoardModel.CL = BaseProjectModel.C('board');

BoardModel.DB_STRUCTURE = {
	_pid: 'string|true',

	BOARD_ID: 'string|true',

	BOARD_STATUS: 'int|true|default=1|comment=状态 0=仅自己可见,1=正常',
	
	BOARD_CATE_ID: 'string|true|default=0|comment=分类',
	BOARD_CATE_NAME: 'string|false|comment=分类冗余',
	BOARD_ORDER: 'int|true|default=9999',
	BOARD_VOUCH: 'int|true|default=0',

	BOARD_USER_ID: 'string|true|comment=用户ID',

	BOARD_DAY: 'string|false|comment=日期',

	BOARD_FORMS: 'array|true|default=[]',
	BOARD_OBJ: 'object|true|default={}',

	BOARD_FAV_CNT: 'int|true|default=0',
	BOARD_FAV_LIST: 'array|true|default=[]',
	BOARD_VIEW_CNT: 'int|true|default=0',
	BOARD_LIKE_CNT: 'int|true|default=0',
	BOARD_LIKE_LIST: 'array|true|default=[]',
	BOARD_COMMENT_CNT: 'int|true|default=0', 

	BOARD_QR: 'string|false',

	BOARD_ADD_TIME: 'int|true',
	BOARD_EDIT_TIME: 'int|true',
	BOARD_ADD_IP: 'string|false',
	BOARD_EDIT_IP: 'string|false',

};

// 字段前缀
BoardModel.FIELD_PREFIX = "BOARD_";

module.exports = BoardModel;