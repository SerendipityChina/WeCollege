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
const BoardModel = require('../../model/board_model.js');
const UserModel = require('../../model/user_model.js');

// 导出数据KEY
const EXPORT_BOARD_DATA_KEY = 'EXPORT_BOARD_DATA';

class AdminBoardService extends BaseProjectAdminService {

	async sortBoard(id, sort) {
		sort = Number(sort);
		let data = {};
		data.BOARD_ORDER = sort;
		await BoardModel.edit(id, data);
	}

	async getAdminBoardList({
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
			'BOARD_ORDER': 'asc',
			'BOARD_ADD_TIME': 'desc'
		};
		let fields = 'BOARD_VIEW_CNT,BOARD_FAV_CNT,BOARD_LIKE_CNT,BOARD_COMMENT_CNT,BOARD_CATE_NAME,BOARD_STATUS,BOARD_ORDER,BOARD_ADD_TIME,BOARD_USER_ID,BOARD_OBJ,user.USER_NAME';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ 'user.USER_NAME': ['like', search] },
				{ 'BOARD_CATE_NAME': ['like', search] },
				{ 'BOARD_OBJ.title': ['like', search] },
				{ 'BOARD_OBJ.company': ['like', search] },
				{ 'BOARD_OBJ.address': ['like', search] },
				{ 'BOARD_OBJ.desc': ['like', search] },
				{ 'BOARD_OBJ.poster': ['like', search] },
				{ 'BOARD_OBJ.tel': ['like', search] },
				{ 'BOARD_OBJ.wx': ['like', search] },
			];

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
				case 'top': {
					where.and.BOARD_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'BOARD_ADD_TIME');
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

	// #####################导出数据
	/**获取数据 */
	async getBoardDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_BOARD_DATA_KEY);
	}

	/**删除数据 */
	async deleteBoardDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_BOARD_DATA_KEY);
	}

	/**导出数据 */
	async exportBoardDataExcel({
		fields,
		status,
		start,
		end,
	}) {
		this.AppError('[校园圈]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminBoardService;