/**
 * Notes: 资讯后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const util = require('../../../../framework/utils/util.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const LostModel = require('../../model/lost_model.js');
const UserModel = require('../../model/user_model.js');

// 导出数据KEY
const EXPORT_LOST_DATA_KEY = 'EXPORT_LOST_DATA';

class AdminLostService extends BaseProjectAdminService {

	async sortLost(id, sort) {
		sort = Number(sort);
		let data = {};
		data.LOST_ORDER = sort;
		await LostModel.edit(id, data);
	}

	async getAdminLostList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'LOST_ORDER': 'asc',
			'LOST_ADD_TIME': 'desc'
		};
		let fields = 'LOST_VIEW_CNT,LOST_FAV_CNT,LOST_LIKE_CNT,LOST_COMMENT_CNT,LOST_CATE_NAME,LOST_STATUS,LOST_ORDER,LOST_ADD_TIME,LOST_USER_ID,LOST_OBJ,user.USER_NAME';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ 'user.USER_NAME': ['like', search] },
				{ 'LOST_CATE_NAME': ['like', search] },
				{ 'LOST_OBJ.title': ['like', search] },
				{ 'LOST_OBJ.company': ['like', search] },
				{ 'LOST_OBJ.address': ['like', search] },
				{ 'LOST_OBJ.desc': ['like', search] },
				{ 'LOST_OBJ.poster': ['like', search] },
				{ 'LOST_OBJ.tel': ['like', search] },
				{ 'LOST_OBJ.wx': ['like', search] },
			];

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
				case 'top': {
					where.and.LOST_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'LOST_ADD_TIME');
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

	// #####################导出数据
	/**获取数据 */
	async getLostDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_LOST_DATA_KEY);
	}

	/**删除数据 */
	async deleteLostDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_LOST_DATA_KEY);
	}

	/**导出数据 */
	async exportLostDataExcel({
		fields,
		status,
		start,
		end,
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminLostService;