/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminJobService = require('../../service/admin/admin_job_service.js');
const JobService = require('../../service/job_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');

class AdminJobController extends BaseProjectAdminController {

	async getAdminJobDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules); 

		let service = new JobService();
		return await service.getJobDetail(input.id);

	}

	async sortJob() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminJobService();
		await service.sortJob(input.id, input.sort);
	}

	async statusJob() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new JobService();
		await service.statusJob(null, input.id, input.status);

	}

	async delJob() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new JobService();
		await service.delJob(null, input.id);

	}

	async getAdminJobList() {
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

		let service = new AdminJobService();
		let result = await service.getAdminJobList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].JOB_ADD_TIME = timeUtil.timestamp2Time(list[k].JOB_ADD_TIME, 'Y-M-D h:m');

			if (list[k].JOB_OBJ && list[k].JOB_OBJ.content)
				delete list[k].JOB_OBJ.content;
		}
		result.list = list;

		return result;

	}

	/************** 用户数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async jobDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminJobService();

		if (input.isDel === 1)
			await service.deleteJobDataExcel(); //先删除 

		return await service.getJobDataURL();
	}

	/** 导出数据 */
	async jobDataExport() {
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

		let service = new AdminJobService();
		return await service.exportJobDataExcel(input);
	}

	/** 删除导出的用户数据 */
	async jobDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminJobService();
		return await service.deleteJobDataExcel();
	}
}

module.exports = AdminJobController;