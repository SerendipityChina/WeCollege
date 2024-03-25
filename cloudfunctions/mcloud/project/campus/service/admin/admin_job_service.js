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
const JobModel = require('../../model/job_model.js');
const UserModel = require('../../model/user_model.js');

// 导出数据KEY
const EXPORT_JOB_DATA_KEY = 'EXPORT_JOB_DATA';

class AdminJobService extends BaseProjectAdminService {

	async sortJob(id, sort) {
		sort = Number(sort);
		let data = {};
		data.JOB_ORDER = sort;
		await JobModel.edit(id, data);
	}

	async getAdminJobList({
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
			'JOB_ORDER': 'asc',
			'JOB_ADD_TIME': 'desc'
		};
		let fields = 'JOB_VIEW_CNT,JOB_FAV_CNT,JOB_LIKE_CNT,JOB_COMMENT_CNT,JOB_CATE_NAME,JOB_STATUS,JOB_ORDER,JOB_ADD_TIME,JOB_USER_ID,JOB_OBJ,user.USER_NAME';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ 'user.USER_NAME': ['like', search] },
				{ 'JOB_CATE_NAME': ['like', search] },
				{ 'JOB_OBJ.title': ['like', search] },
				{ 'JOB_OBJ.company': ['like', search] },
				{ 'JOB_OBJ.address': ['like', search] },
				{ 'JOB_OBJ.desc': ['like', search] },
				{ 'JOB_OBJ.poster': ['like', search] },
				{ 'JOB_OBJ.tel': ['like', search] },
				{ 'JOB_OBJ.wx': ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.JOB_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.JOB_STATUS = Number(sortVal);
					break;
				}
				case 'top': {
					where.and.JOB_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'JOB_ADD_TIME');
					break;
				}

			}
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'JOB_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await JobModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	// #####################导出数据
	/**获取数据 */
	async getJobDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_JOB_DATA_KEY);
	}

	/**删除数据 */
	async deleteJobDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_JOB_DATA_KEY);
	}

	/**导出数据 */
	async exportJobDataExcel({
		fields,
		status,
		start,
		end,
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminJobService;