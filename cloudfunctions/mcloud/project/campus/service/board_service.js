/**
 * Notes: 表白墙模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */

const BaseProjectService = require('./base_project_service.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const BoardModel = require('../model/board_model.js');
const UserModel = require('../model/user_model.js');

class BoardService extends BaseProjectService {

	/** 点赞 */
	async likeBoard(userId, id) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 浏览 */
	async viewBoard(id) {
		let fields = '*';

		let where = {
			_id: id,
			BOARD_STATUS: 1
		}
		let board = await BoardModel.getOne(where, fields);
		if (!board) return null;

		BoardModel.inc(id, 'BOARD_VIEW_CNT', 1);

		return board;
	}

	/** 获取 */
	async getBoardDetail(id) {
		return await BoardModel.getOne(id);
	}

	/** 修改状态 */
	async statusBoard(userId, id, status) {
		let data = {
			BOARD_STATUS: Number(status)
		}
		let where = { 
			_id: id,
		}
		if (userId) where.BOARD_USER_ID = userId; // for  admin

		return await BoardModel.edit(where, data);

	}

	/** 删除 */
	async delBoard(userId, id) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 插入 */
	async insertBoard(userId, {
		cateId,
		cateName,
		order,
		forms
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 修改 */
	async editBoard(userId, {
		id,
		cateId,
		cateName,
		order,
		forms
	}) {

		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 更新forms信息 */
	async updateBoardForms({
		id,
		hasImageForms
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 列表与搜索 */
	async getBoardList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal }) {
		orderBy = orderBy || {
			'BOARD_ORDER': 'asc',
			'BOARD_ADD_TIME': 'desc'
		};
		let fields = 'BOARD_ORDER,BOARD_CATE_ID,BOARD_CATE_NAME,BOARD_STATUS,BOARD_COMMENT_CNT,BOARD_VIEW_CNT,BOARD_FAV_CNT,BOARD_FAV_LIST,BOARD_LIKE_CNT,BOARD_LIKE_LIST,BOARD_ADD_TIME,BOARD_USER_ID,BOARD_OBJ,user.USER_NAME,user.USER_PIC';

		let where = {};
		where.and = {
			BOARD_STATUS: 1,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};


		if (util.isDefined(search) && search) {
			if (search == '我的表白') {
				where.and.BOARD_USER_ID = userId;
				if (util.isDefined(where.and.BOARD_STATUS)) delete where.and.BOARD_STATUS;
			}
			else if (search == '我的点赞') {
				where.and.BOARD_LIKE_LIST = userId;
			}
			else if (search == '我的收藏') {
				where.and.BOARD_FAV_LIST = userId;
			}
			else {
				where.or = [
					{ 'BOARD_OBJ.to': ['like', search] },
					{ 'BOARD_OBJ.from': ['like', search] },
					{ 'BOARD_OBJ.desc': ['like', search] },
				];
			}

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.BOARD_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.BOARD_STATUS = Number(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'BOARD_ADD_TIME');
					break;
				}
				case 'fav': {
					orderBy = {
						'BOARD_FAV_CNT': 'desc',
						'BOARD_ADD_TIME': 'desc'
					}
					break;
				}
				case 'comment': {
					orderBy = {
						'BOARD_COMMENT_CNT': 'desc',
						'BOARD_ADD_TIME': 'desc'
					}
					break;
				}
				case 'like': {
					orderBy = {
						'BOARD_LIKE_CNT': 'desc',
						'BOARD_ADD_TIME': 'desc'
					}
					break;
				}
				case 'today': {
					where.and.BOARD_DAY = timeUtil.time('Y-M-D');
					break;
				}
				case 'yesterday': {
					where.and.BOARD_DAY = timeUtil.time('Y-M-D', -86400);
					break;
				}
			}
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'BOARD_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await BoardModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);

	}

}

module.exports = BoardService;