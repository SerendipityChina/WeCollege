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
const LeaveModel = require('../../model/leave_model.js');
const UserModel = require('../../model/user_model.js');

// 导出数据KEY
const EXPORT_LEAVE_DATA_KEY = 'EXPORT_LEAVE_DATA';

class AdminLeaveService extends BaseProjectAdminService {

	async sortLeave(id, sort) {
		sort = Number(sort);
		let data = {};
		data.LEAVE_ORDER = sort;
		await LeaveModel.edit(id, data);
	}

	async getAdminLeaveList({
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
			'LEAVE_ORDER': 'asc',
			'LEAVE_ADD_TIME': 'desc'
		};
		let fields = 'LEAVE_VIEW_CNT,LEAVE_FAV_CNT,LEAVE_LIKE_CNT,LEAVE_COMMENT_CNT,LEAVE_CATE_NAME,LEAVE_STATUS,LEAVE_ORDER,LEAVE_ADD_TIME,LEAVE_USER_ID,LEAVE_OBJ,user.USER_NAME';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ 'user.USER_NAME': ['like', search] },
				{ 'LEAVE_CATE_NAME': ['like', search] },
				{ 'LEAVE_OBJ.title': ['like', search] },
				{ 'LEAVE_OBJ.company': ['like', search] },
				{ 'LEAVE_OBJ.address': ['like', search] },
				{ 'LEAVE_OBJ.desc': ['like', search] },
				{ 'LEAVE_OBJ.poster': ['like', search] },
				{ 'LEAVE_OBJ.tel': ['like', search] },
				{ 'LEAVE_OBJ.wx': ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.LEAVE_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.LEAVE_STATUS = Number(sortVal);
					break;
				}
				case 'top': {
					where.and.LEAVE_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'LEAVE_ADD_TIME');
					break;
				}

			}
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'LEAVE_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await LeaveModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	// #####################导出数据
	/**获取数据 */
	async getLeaveDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_LEAVE_DATA_KEY);
	}

	/**删除数据 */
	async deleteLeaveDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_LEAVE_DATA_KEY);
	}

	/**导出数据 */
	async exportLeaveDataExcel({
		fields,
		status,
		start,
		end,
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminLeaveService;