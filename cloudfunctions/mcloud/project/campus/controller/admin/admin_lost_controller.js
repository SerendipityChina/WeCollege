/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminLostService = require('../../service/admin/admin_lost_service.js');
const LostService = require('../../service/lost_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');

class AdminLostController extends BaseProjectAdminController {

	async getAdminLostDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules); 

		let service = new LostService();
		return await service.getLostDetail(input.id);

	}

	async sortLost() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminLostService();
		await service.sortLost(input.id, input.sort);
	}

	async statusLost() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LostService();
		await service.statusLost(null, input.id, input.status);

	}

	async delLost() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LostService();
		await service.delLost(null, input.id);

	}

	async getAdminLostList() {
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

		let service = new AdminLostService();
		let result = await service.getAdminLostList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].LOST_ADD_TIME = timeUtil.timestamp2Time(list[k].LOST_ADD_TIME, 'Y-M-D h:m');

			if (list[k].LOST_OBJ && list[k].LOST_OBJ.content)
				delete list[k].LOST_OBJ.content;
		}
		result.list = list;

		return result;

	}

	/************** 用户数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async lostDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminLostService();

		if (input.isDel === 1)
			await service.deleteLostDataExcel(); //先删除 

		return await service.getLostDataURL();
	}

	/** 导出数据 */
	async lostDataExport() {
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

		let service = new AdminLostService();
		return await service.exportLostDataExcel(input);
	}

	/** 删除导出的用户数据 */
	async lostDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminLostService();
		return await service.deleteLostDataExcel();
	}
}

module.exports = AdminLostController;