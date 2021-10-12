import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFile } from '../file.model';
import { FileService } from '../service/file.service';
import { FileDeleteDialogComponent } from '../delete/file-delete-dialog.component';

@Component({
  selector: 'jhi-file',
  templateUrl: './file.component.html',
})
export class FileComponent implements OnInit {
  files?: IFile[];
  isLoading = false;

  constructor(protected fileService: FileService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fileService.query().subscribe(
      (res: HttpResponse<IFile[]>) => {
        this.isLoading = false;
        this.files = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFile): number {
    return item.id!;
  }

  delete(file: IFile): void {
    const modalRef = this.modalService.open(FileDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.file = file;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
