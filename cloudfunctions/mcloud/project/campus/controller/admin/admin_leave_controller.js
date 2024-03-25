/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminLeaveService = require('../../service/admin/admin_leave_service.js');
const LeaveService = require('../../service/leave_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');

class AdminLeaveController extends BaseProjectAdminController {

	async getAdminLeaveDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules); 

		let service = new LeaveService();
		return await service.getLeaveDetail(input.id);

	}

	async sortLeave() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminLeaveService();
		await service.sortLeave(input.id, input.sort);
	}

	async statusLeave() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LeaveService();
		await service.statusLeave(null, input.id, input.status);

	}

	async delLeave() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LeaveService();
		await service.delLeave(null, input.id);

	}

	async getAdminLeaveList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminLeaveService();
		let result = await service.getAdminLeaveList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].LEAVE_ADD_TIME = timeUtil.timestamp2Time(list[k].LEAVE_ADD_TIME, 'Y-M-D h:m');

			if (list[k].LEAVE_OBJ && list[k].LEAVE_OBJ.content)
				delete list[k].LEAVE_OBJ.content;
		}
		result.list = list;

		return result;

	}

	/************** 用户数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async leaveDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminLeaveService();

		if (input.isDel === 1)
			await service.deleteLeaveDataExcel(); //先删除 

		return await service.getLeaveDataURL();
	}

	/** 导出数据 */
	async leaveDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			start: 'string|must',
			end: 'string|must',
			status: 'int|must',
			fields: 'array',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminLeaveService();
		return await service.exportLeaveDataExcel(input);
	}

	/** 删除导出的用户数据 */
	async leaveDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminLeaveService();
		return await service.deleteLeaveDataExcel();
	}
}

module.exports = AdminLeaveController;