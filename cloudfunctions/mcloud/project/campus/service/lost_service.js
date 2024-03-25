/**
 * Notes: 兼职模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */

const BaseProjectService = require('./base_project_service.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const LostModel = require('../model/lost_model.js');
const UserModel = require('../model/user_model.js');

class LostService extends BaseProjectService {

	/** 点赞 */
	async likeLost(userId, id) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 浏览 */
	async viewLost(userId, id) {
		let fields = '*';

		let where = {
			_id: id,
			//LOST_STATUS: 1
		}

		if (userId && util.isDefined(where.LOST_STATUS)) delete where.LOST_STATUS;

		let lost = await LostModel.getOne(where, fields);
		if (!lost) return null;

		LostModel.inc(id, 'LOST_VIEW_CNT', 1);

		return lost;
	}

	/** 获取 */
	async getLostDetail(id) {
		return await LostModel.getOne(id);
	}

	/** 修改状态 */
	async statusLost(userId, id, status) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/** 删除 */
	async delLost(userId, id) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 插入 */
	async insertLost(userId, {
		cateId,
		cateName,
		order,
		forms
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 修改 */
	async editLost(userId, {
		id,
		cateId,
		cateName,
		order,
		forms
	}) {

		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 更新forms信息 */
	async updateLostForms({
		id,
		hasImageForms
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 列表与搜索 */
	async getLostList(userId, {
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
			'LOST_ORDER': 'asc',
			'LOST_ADD_TIME': 'desc'
		};
		let fields = 'LOST_ORDER,LOST_CATE_ID,LOST_CATE_NAME,LOST_STATUS,LOST_COMMENT_CNT,LOST_VIEW_CNT,LOST_FAV_CNT,LOST_FAV_LIST,LOST_LIKE_CNT,LOST_LIKE_LIST,LOST_ADD_TIME,LOST_USER_ID,LOST_OBJ,user.USER_NAME,user.USER_PIC';

		let where = {};
		where.and = {
			//LOST_STATUS: 1,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};


		if (util.isDefined(search) && search) {
			if (search == '我的发布') {
				where.and.LOST_USER_ID = userId;
			}
			else if (search == '我的点赞') {
				where.and.LOST_LIKE_LIST = userId;
			}
			else if (search == '我的收藏') {
				where.and.LOST_FAV_LIST = userId;
			}
			else {
				where.or = [
					{ 'LOST_OBJ.title': ['like', search] },
					{ 'LOST_OBJ.desc': ['like', search] },
					{ 'LOST_OBJ.poster': ['like', search] },
					{ 'LOST_OBJ.tel': ['like', search] },
					{ 'LOST_OBJ.wx': ['like', search] },
				];
			}

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.LOST_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.LOST_STATUS = Number(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'LOST_ADD_TIME');
					break;
				}
				case 'fav': {
					orderBy = {
						'LOST_FAV_CNT': 'desc',
						'LOST_ADD_TIME': 'desc'
					}
					break;
				}
				case 'comment': {
					orderBy = {
						'LOST_COMMENT_CNT': 'desc',
						'LOST_ADD_TIME': 'desc'
					}
					break;
				}
				case 'like': {
					orderBy = {
						'LOST_LIKE_CNT': 'desc',
						'LOST_ADD_TIME': 'desc'
					}
					break;
				}
				case 'today': {
					where.and.LOST_DAY = timeUtil.time('Y-M-D');
					break;
				}
				case 'yesterday': {
					where.and.LOST_DAY = timeUtil.time('Y-M-D', -86400);
					break;
				}
			}
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'LOST_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await LostModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);

	}

}

module.exports = LostService;