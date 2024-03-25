/**
 * Notes: 兼职模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const JobService = require('../service/job_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class JobController extends BaseProjectController {

	/** 点赞 */
	async likeJob() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new JobService();
		return await service.likeJob(this._userId, input.id);
	}

	/** 获取信息用于编辑修改 */
	async getJobDetail() {

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new JobService();
		let job = await service.getJobDetail(input.id);
		if (job) {
		}

		return job;

	}

	/** 浏览详细 */
	async viewJob() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new JobService();
		let job = await service.viewJob(this._userId, input.id);

		if (job) {
			job.JOB_ADD_TIME = timeUtil.timestamp2Time(job.JOB_ADD_TIME, 'Y-M-D h:m');

			// 本人是否点赞 
			if (job.JOB_LIKE_LIST
				&& Array.isArray(job.JOB_LIKE_LIST)
				&& job.JOB_LIKE_LIST.includes(this._userId))
				job.like = true;
			else
				job.like = false;

			// 删除冗余 
			if (job.JOB_LIKE_LIST) delete job.JOB_LIKE_LIST;
			if (job.JOB_FAV_LIST) delete job.JOB_FAV_LIST;
		}

		return job;
	}

	/** 状态修改 */
	async statusJob() {
		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new JobService();
		return await service.statusJob(this._userId, input.id, input.status);

	}

	/** 列表与搜索 */
	async getJobList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new JobService();
		let result = await service.getJobList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].JOB_ADD_TIME = timeUtil.timestamp2Time(list[k].JOB_ADD_TIME, 'Y-M-D h:m');

			// 本人是否点赞 
			if (list[k].JOB_LIKE_LIST
				&& Array.isArray(list[k].JOB_LIKE_LIST)
				&& list[k].JOB_LIKE_LIST.includes(this._userId))
				list[k].like = true;
			else
				list[k].like = false;

			// 本人是否收藏
			if (list[k].JOB_FAV_LIST
				&& Array.isArray(list[k].JOB_FAV_LIST)
				&& list[k].JOB_FAV_LIST.includes(this._userId))
				list[k].fav = true;
			else
				list[k].fav = false;

			// 删除冗余
			if (list[k].JOB_OBJ.content) delete list[k].JOB_OBJ.content;
			if (list[k].JOB_LIKE_LIST) delete list[k].JOB_LIKE_LIST;
			if (list[k].JOB_FAV_LIST) delete list[k].JOB_FAV_LIST;
		}

		return result;

	}

	/** 发布 */
	async insertJob() {

		// 数据校验 
		let rules = {
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new JobService();
		let result = await service.insertJob(this._userId, input);

		return result;

	}

	/** 修改 */
	async editJob() {

		// 数据校验 
		let rules = {
			id: 'must|id',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new JobService();
		let result = await service.editJob(this._userId, input);

		return result;

	}

	/** 更新图片信息 */
	async updateJobForms() {

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new JobService();
		return await service.updateJobForms(input);
	}

	/** 删除 */
	async delJob() {

		// 数据校验
		let rules = {
			id: 'must|id',
			isAdmin: 'must|bool'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new JobService();
		await service.delJob(this._userId, input.id);

	}

}

module.exports = JobController;